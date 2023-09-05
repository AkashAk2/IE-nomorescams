from flask import Flask, render_template, request, redirect, url_for, flash, session
import secrets, pyodbc

# Generate the secret_key each time and specify the static folder at the same time
app = Flask(__name__)
app.secret_key = secrets.token_hex(16)


@app.route('/', methods=['GET', 'POST'])
def index():
    if 'authenticated' in session and session['authenticated']:
        return render_template('index.html')  # index.html is the default page
    if request.method == 'POST':
        password = request.form.get('password')
        if password == 'Monash@27':  # website password
            session['authenticated'] = True
            return redirect(url_for('index'))
        else:
            flash('Wrong password. Please try again.')
    return render_template('password_prompt.html')

# Test connection to the database
@app.route('/test-connection')
def test_connection():
    try:
        # Setting up connection string for Azure SQL
        server = 'tcp:fit5120server.database.windows.net,1433'
        database = 'fit5120-db'
        username = 'team27'  # replace with your username
        password = 'Monash@27'  # replace with your password
        driver = '{ODBC Driver 18 for SQL Server}'

        connection_string = (f'DRIVER={driver};SERVER={server};DATABASE={database};'
                             f'UID={username};PWD={password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;')

        cnx = pyodbc.connect(connection_string)
        cnx.close()
        return "Successful database connection!"
    except Exception as e:
        return f"Error: {e}"

if __name__ == '__main__':
    app.run(debug=True)
