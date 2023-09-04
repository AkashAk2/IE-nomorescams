const express = require('express');
const sql = require('mssql');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());


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

async function queryScamStatistics() {
    try {
        // Establish a connection
        let pool = await sql.connect(config);

        // Query the "scam_statistics" table
        const result = await pool.request().query('SELECT * FROM scam_loss_statistics');

        // Close the connection
        await pool.close();
        const jsonResult = JSON.stringify(result.recordset);
        return jsonResult; // Return the query result as an array of objects
    } catch (err) {
        console.error('SQL error', err);
        throw err; // Rethrow the error for handling in the calling code
    }
}

// Serve static files from the root directory
app.use(express.static(__dirname));

//Test database connection
// app.get('/testdb', async (req, res) => {
//     let isConnected = await testConnection();
//     if (isConnected) {
//         res.send('Database is connected');
//     } else {
//         res.status(500).send('Failed to connect to the database');
//     }
// });

app.get('https://fit5120.azurewebsites.net/scam_statistics', async (req, res) => {
    let data = await queryScamStatistics();
    if (data) {
        res.send(data);
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
