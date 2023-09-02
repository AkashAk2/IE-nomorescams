const express = require('express');
const sql = require('mssql');
const app = express();
const port = process.env.PORT || 3000;

const config = {
    user: 'team27@fit5120server',
    password: 'Monash@27', // Replace with your actual password
    server: 'fit5120server.database.windows.net',
    database: 'fit5120-db',
    options: {
        encrypt: true // Azure SQL Database always requires encryption
    }
};

async function testConnection() {
    try {
        // Establish a connection
        let pool = await sql.connect(config);
        await pool.close();

        return true;
    } catch (err) {
        console.error('SQL error', err);
        return false;
    }
}

// Serve static files from the root directory
app.use(express.static(__dirname));

//Test database connection
app.get('/testdb', async (req, res) => {
    let isConnected = await testConnection();
    if (isConnected) {
        res.send('Database is connected');
    } else {
        res.status(500).send('Failed to connect to the database');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Handle app termination gracefully
process.on('SIGTERM', () => {
    sql.close(); // close sql connection on app termination
});
process.on('exit', () => {
    sql.close(); // close sql connection on app termination
});
