from flask import Blueprint, render_template, request, redirect, url_for, flash, session
import secrets, os
import mysql.connector

iteration1 = Blueprint('iteration1', __name__, 
                       template_folder='templates', 
                       static_folder='static')

# iteration1.secret_key = secrets.token_hex(16)

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


@iteration1.route('/', methods=['GET', 'POST'])
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

        return render_template('iteration1_index.html', total_loss=total_loss, number_of_reports=number_of_reports, affected_people_65plus=affected_people_65plus)

    if request.method == 'POST':
        password = request.form.get('password')
        if password == 'Monash@27':
            session['authenticated'] = True
            return redirect(url_for('iteration1.index'))

        else:
            flash('Wrong password. Please try again.')
            return render_template('password_prompt.html')

    return render_template('password_prompt.html')

#home
@iteration1.route('/home')
def home():
    return render_template('iteration1_index.html')

#scam
@iteration1.route('/scam')
def scam():
    return render_template('iteration1_scam.html')

#safemethods
@iteration1.route('/safemethods')
def safemethods():
    return render_template('iteration1_accountsafety.html')

#statistics
@iteration1.route('/statistics')
def statistics():
    return render_template('iteration1_statistics.html')

#report
@iteration1.route('/report')
def report():
    return render_template('iteration1_report.html')


