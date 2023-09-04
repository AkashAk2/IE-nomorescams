from flask import Flask
import secrets, pyodbc

app = Flask(__name__)

# Generate the secret_key each time
app.secret_key = secrets.token_hex(16)

# Test connection to the database
@app.route('/test-connection')
def test_connection():
    try:
        # Setting up connection string for Azure SQL
        server = 'fit5120server.database.windows.net'
        database = 'fit5120-db'
        username = 'team27'  # replace with your username
        password = 'Monash@27'  # replace with your password
        driver = '{ODBC Driver 17 for SQL Server}'
        
        connection_string = (f'DRIVER={driver};SERVER={server};DATABASE={database};'
                             f'UID={username};PWD={password};Encrypt=True;TrustServerCertificate=False')
        
        cnx = pyodbc.connect(connection_string)
        cnx.close()
        return "Successful database connection!"
    except Exception as e:
        return f"Error: {e}"

if __name__ == '__main__':
    app.run(debug=True)
