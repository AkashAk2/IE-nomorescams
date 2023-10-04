from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
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


app = Flask(__name__)
app.register_blueprint(iteration1, url_prefix='/iteration1')
app.register_blueprint(iteration2, url_prefix='/iteration2')
app.secret_key = secrets.token_hex(16)

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

#safemethods
@app.route('/safemethods')
def safemethods():
    return render_template('accountsafety.html')

#statistics
@app.route('/statistics')
def statistics():
    return render_template('statistics.html')

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

@app.route('/detect_scam', methods=['GET', 'POST'])
def detect_scam():
    # initialize variables to their default states
    prediction = None
    original_message = ""
    
    if request.method == 'POST':
        df = pd.read_csv("spam.csv", encoding="latin-1")
        df = df.dropna(how="any", axis=1)
        df.columns = ['label', 'message']
        df['message_clean'] = df['message'].apply(clean_text)
        # Features and Labels
        df['label'] = df['label'].map({'ham': 0, 'spam': 1})
        X = df['message_clean']
        y = df['label']
        # Extract Feature With CountVectorizer
        cv = CountVectorizer()
        X = cv.fit_transform(X)  # Fit the Data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=42)
        # Naive Bayes Classifier
        clf = MultinomialNB()
        clf.fit(X_train, y_train)
        clf.score(X_test, y_test)
        
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

