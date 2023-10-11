from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import requests
from iteration1.iteration1_blueprint import iteration1
from iteration2.iteration2_blueprint import iteration2
import secrets, os
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
import re
import string
import mysql.connector
from googleapiclient import discovery
from googleapiclient.errors import HttpError
import joblib
import time


app = Flask(__name__)
app.register_blueprint(iteration1, url_prefix='/iteration1')
app.register_blueprint(iteration2, url_prefix='/iteration2')
app.secret_key = secrets.token_hex(16)

WEB_RISK_API_KEY = 'AIzaSyAS7xBvDz9u70txO4BiCWTPTCWnZeCqHXw'
CLIENT_ID = "nomorescams"  # Replace with your client ID
CLIENT_VERSION = "1.0"  # Adjust as necessary
VIRUSTOTAL_API_KEY = "6908dc82cfc9e3d263e55f59ef24ad91c0125dd6ea7269767b767b19715f91f5"



DB_CONFIG = {
    'user': 'team27',
    'password': 'Monash@27',
    'host': 'nomorescams-mysql.mysql.database.azure.com',
    'port': 3306,
    'database': 'nomorescams',
    'ssl_ca': 'static/resources/key/BaltimoreCyberTrustRoot.crt.pem',
    'ssl_disabled': False
}

def get_db_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return None

@app.route('/', methods=['GET', 'POST'])
def index():
    if 'authenticated' in session and session['authenticated']:
        total_loss, number_of_reports, affected_people_65plus = "N/A", "N/A", "N/A"

        cnx = get_db_connection()
        if cnx:
            cursor = cnx.cursor()
            cursor.execute("SELECT Total_Monetary_Loss, Number_of_reports, Affected_people_aged_65plus FROM scam_loss_statistics")
            result = cursor.fetchone()
            if result:
                total_loss = str(result[0])
                number_of_reports = str(result[1])
                affected_people_65plus = str(result[2])
                print("Data fetched:", result)
            else:
                print("No data returned from the query.")
            cnx.close()

        return render_template('index.html', total_loss=total_loss, number_of_reports=number_of_reports, affected_people_65plus=affected_people_65plus)

    if request.method == 'POST':
        password = request.form.get('password')
        if password == 'Monash@27':
            session['authenticated'] = True
            return redirect(url_for('index'))
        else:
            flash('Wrong password. Please try again.')
            return render_template('password_prompt.html')

    return render_template('password_prompt.html')


#home
@app.route('/home')
def home():
    return render_template('index.html')

#scam
@app.route('/scam')
def scam():
    return render_template('scam.html')


def check_haveibeenpwned(email):
    headers = {
        'hibp-api-key': 'd359dfbab34e41e2a293bb7a601b8df0',  
        'User-Agent': 'nomorescams'     
    }
    
    response = requests.get(f'https://haveibeenpwned.com/api/v3/breachedaccount/{email}', headers=headers)
    
    if response.status_code == 200:
        breaches = response.json()
        num_breaches = len(breaches)
        breach_names = ', '.join([breach['Name'] for breach in breaches])
        return False, f"Oh No! Your email has been found in {num_breaches} breaches: {breach_names}", "red"
    
    elif response.status_code == 404:
        # Email was not found to be part of any breaches
        return True, "Your email has not been found in any breaches.", "green"

    
    else:
        return False, f"Error: {response.status_code}"

@app.route('/checkemail', methods=['GET', 'POST'])
def checkemail():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email', None)
        
        if email:
            # Check email with HaveIBeenPwned
            email_is_safe, email_message, color = check_haveibeenpwned(email)
            return jsonify({"result": email_message, "color": color})


        # If the email parameter isn't provided, return a default message.
        return jsonify({"result": "Please enter an email."})

    return render_template('checkemail.html')



def get_all_threat_types(WEB_RISK_API_KEY):
    response = requests.get(f"https://safebrowsing.googleapis.com/v4/threatLists?key={WEB_RISK_API_KEY}")
    if response.status_code == 200:
        data = response.json()
        return list(set([entry['threatType'] for entry in data.get('threatLists', [])]))
    else:
        print("Error retrieving threat types:", response.content)
        return []


def check_virustotal(url, max_retries=5, retry_interval=5):
    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY
    }

    data = {
        "url": url
    }

    response = requests.post("https://www.virustotal.com/api/v3/urls", headers=headers, data=data)

    if response.status_code != 200:
        return False, "Error connecting to VirusTotal"

    # Extract ID from the response to retrieve the analysis result
    id_ = response.json()["data"]["id"]
    analysis_url = f"https://www.virustotal.com/api/v3/analyses/{id_}"

    retries = 0
    while retries < max_retries:
        analysis_response = requests.get(analysis_url, headers=headers)

        if analysis_response.status_code != 200:
            return False, "Error fetching analysis from VirusTotal"

        stats = analysis_response.json()["data"]["attributes"]["stats"]
        malicious = stats["malicious"]
        suspicious = stats["suspicious"]

        if malicious or suspicious:
            break  # We got our result

        # If not malicious or suspicious, wait and then retry
        time.sleep(retry_interval)
        retries += 1

    if malicious > 0 or suspicious > 0:
        return False, f"The URL is considered malicious by {malicious} sources and suspicious by {suspicious} sources on VirusTotal"
    
    return True, "The URL seems safe on VirusTotal"

#URL
@app.route('/checkurl', methods=['GET', 'POST'])
def checkurl():
    if request.method == 'POST':
        data = request.get_json()
        url = data.get('url', None)
        
        if url:
            safe_on_google = True
            safe_on_virustotal = True
            source_google = None
            source_virustotal = None

            # Check with VirusTotal
            safe_on_virustotal, virustotal_message = check_virustotal(url)
            source_virustotal = None if safe_on_virustotal else "VirusTotal"
            
            # Check with Google Safe Browsing
            try:
                service = discovery.build('safebrowsing', 'v4', developerKey=WEB_RISK_API_KEY)
                all_threat_types = list(get_all_threat_types(WEB_RISK_API_KEY))
                body = {
                    "client": {
                        "clientId": CLIENT_ID,
                        "clientVersion": CLIENT_VERSION
                    },
                    "threatInfo": {
                        "threatTypes": all_threat_types,
                        "platformTypes": ["ANY_PLATFORM"],
                        "threatEntryTypes": ["URL"],
                        "threatEntries": [{"url": url}]
                    }
                }

                response = service.threatMatches().find(body=body).execute()
                if 'matches' in response:
                    safe_on_google = False
                    source_google = "Google Safe Browsing"
            except Exception as e:
                safe_on_google = False
                source_google = f"Google API Error: {e}"

            if not safe_on_google or not safe_on_virustotal:
                # Combine sources
                sources = [src for src in [source_google, source_virustotal] if src]
                message = "The URL may not be safe. Flagged by: " + ", ".join(sources)
                return jsonify({"result": message})

            return jsonify({"result": "The URL seems safe."})

    return render_template('checkurl.html')



#report
@app.route('/resources')
def resources():
    return render_template('resources.html')

# #scam email detect
# @app.route('/detect_scam')
# def detect_scam():
#     return render_template('detect_scam.html')


def clean_text(text):
    '''Make text lowercase, remove text in square brackets,remove links,remove punctuation
    and remove words containing numbers.'''
    text = str(text).lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text

# @app.route('/detect_scam', methods=['GET', 'POST'])
# def detect_scam():
#     # initialize variables to their default states
#     prediction = None
#     original_message = ""
    
#     if request.method == 'POST':
#         df = pd.read_csv("spam.csv", encoding="latin-1")
#         df = df.dropna(how="any", axis=1)
#         df.columns = ['label', 'message']
#         df['message_clean'] = df['message'].apply(clean_text)
#         # Features and Labels
#         df['label'] = df['label'].map({'ham': 0, 'spam': 1})
#         X = df['message_clean']
#         y = df['label']
#         # Extract Feature With CountVectorizer
#         cv = CountVectorizer()
#         X = cv.fit_transform(X)  # Fit the Data
#         X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=42)
#         # Naive Bayes Classifier
#         clf = MultinomialNB()
#         clf.fit(X_train, y_train)
#         clf.score(X_test, y_test)
        
#         original_message = request.form['message']
#         data = [original_message]
#         vect = cv.transform(data).toarray()
#         prediction = clf.predict(vect)

#         # Instead of rendering a template for POST, return a JSON response
#         return jsonify({'prediction': int(prediction[0]), 'original_message': original_message})
    
#     # For GET requests, render the template as usual
#     return render_template('detect_scam.html', prediction=prediction, original_message=original_message)


@app.route('/detect_scam', methods=['GET', 'POST'])
def detect_scam():
    # initialize variables to their default states
    prediction = None
    original_message = ""
    
    if request.method == 'POST':
        # load the CountVectorizer
        cv = joblib.load('./ml_model/count_vectorizer.joblib')
        # Load the model
        clf = joblib.load('./ml_model/spam_classifier_model.joblib')
        original_message = request.form['message']
        data = [original_message]
        vect = cv.transform(data).toarray()
        prediction = clf.predict(vect)

        # Instead of rendering a template for POST, return a JSON response
        return jsonify({'prediction': int(prediction[0]), 'original_message': original_message})
    
    # For GET requests, render the template as usual
    return render_template('detect_scam.html', prediction=prediction, original_message=original_message)



    
@app.route('/test-mysql-connection')
def test_mysql_connection():
    try:
        cnx = mysql.connector.connect(
            user="team27",
            password="Monash@27",
            host="nomorescams-mysql.mysql.database.azure.com",
            port=3306,
            database="nomorescams",
            ssl_ca="static/resources/key/BaltimoreCyberTrustRoot.crt.pem",
            ssl_disabled=False
        )
        cnx.close()
        return "Successful MySQL database connection!"
    except Exception as e:
        return f"Error: {e}"

# Test fetch data from MySQL database
@app.route('/fetch-data')
def fetch_data():
    try:
        # Connect to the database
        cnx = mysql.connector.connect(**DB_CONFIG)
        cursor = cnx.cursor(dictionary=True)

        # Execute the SELECT query
        cursor.execute("SELECT Total_Monetary_Loss, Number_of_reports, Affected_people_aged_65plus FROM scam_loss_statistics")
        
        # Fetch all rows
        rows = cursor.fetchall()

        # Close the cursor and the connection
        cursor.close()
        cnx.close()

        # Return the fetched data
        return jsonify(rows)

    except mysql.connector.Error as err:
        return jsonify(status='error', message=str(err))
    except Exception as e:
        return jsonify(status='error', message=f"General Error: {e}")


# @app.route('/create-mysql-table')
# def create_mysql_table():
#     cnx = None
#     cursor = None

#     try:
#         # Connect to the database
#         cnx = mysql.connector.connect(
#             user="team27",
#             password="Monash@27",
#             host="nomorescams-mysql.mysql.database.azure.com",
#             port=3306,
#             database="nomorescams",
#             ssl_ca="static/resources/key/BaltimoreCyberTrustRoot.crt.pem",
#             ssl_disabled=False
#         )
#         cursor = cnx.cursor()

#         # Create the table
#         cursor.execute("""
#         CREATE TABLE IF NOT EXISTS scam_loss_statistics (
#             Total_Monetary_Loss BIGINT,
#             Number_of_reports INT,
#             Affected_people_aged_65plus INT
#         );
#         """)

#         # Check if the data already exists to prevent duplicate entries
#         cursor.execute("SELECT COUNT(*) FROM scam_loss_statistics WHERE Total_Monetary_Loss = 568640274")
#         result = cursor.fetchone()
#         if result[0] == 0:
#             # Insert the data if it doesn't exist
#             cursor.execute("""
#             INSERT INTO scam_loss_statistics (Total_Monetary_Loss, Number_of_reports, Affected_people_aged_65plus)
#             VALUES (568640274, 239237, 49163);
#             """)

#         # Commit the changes
#         cnx.commit()

#         return "Table created and data inserted successfully!"

#     except mysql.connector.Error as err:
#         if err.errno == mysql.connector.errorcode.ER_TABLE_EXISTS_ERROR:
#             return "Table already exists."
#         elif err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
#             return "Database does not exist."
#         else:
#             return f"Database error: {err}"
#     except Exception as e:
#         return f"General error: {e}"
#     finally:
#         if cursor:
#             cursor.close()
#         if cnx:
#             cnx.close()




if __name__ == '__main__':
    app.run(debug=True)

