from flask import Flask, render_template, request, redirect, url_for, flash, session
import secrets, pyodbc, os

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

def get_db_connection():
    try:
        # Setting up connection string for Azure SQL
        server = 'tcp:fit5120server.database.windows.net,1433'
        database = 'fit5120-db'
        username = 'team27'  # replace with your username
        password = 'Monash@27'  # replace with your password
        driver = '{ODBC Driver 17 for SQL Server}'

        connection_string = (f'DRIVER={driver};SERVER={server};DATABASE={database};'
                             f'UID={username};PWD={password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;')


        return pyodbc.connect(connection_string)
    except Exception as e:
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
    
    # Handle password submission and validation
    if request.method == 'POST':
        password = request.form.get('password')
        if password == 'Monash@27':  # replace 'Your_Secure_Password' with your actual password or a more secure validation method
            session['authenticated'] = True
            return redirect(url_for('index'))
        else:
            flash('Wrong password. Please try again.')
            return render_template('password_prompt.html')
    
    # User is not authenticated and hasn't made a POST request
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
@app.route('/report')
def report():
    return render_template('report.html')





@app.route('/test-connection')
def test_connection():
    try:
        # Setting up connection string for Azure SQL
        # Setting up connection string for Azure SQL
        server = 'tcp:fit5120server.database.windows.net,1433'
        database = 'fit5120-db'
        username = 'team27'  # replace with your username
        password = 'Monash@27'  # replace with your actual password
        driver = '{ODBC Driver 17 for SQL Server}'  # Note that you have updated the driver version to 18.

        connection_string = (f'DRIVER={driver};SERVER={server};DATABASE={database};'
                     f'UID={username};PWD={password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;')


        cnx = pyodbc.connect(connection_string)
        cnx.close()
        return "Successful database connection!"
    except Exception as e:
        return f"Error: {e}"

if __name__ == '__main__':
    app.run(debug=True)
