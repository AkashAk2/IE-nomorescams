const express = require('express');
const sql = require('mssql');
const fs = require('fs');
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

async function getScamStatistics() {
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM scam_loss_statistics');
        await pool.close();
        return result.recordset[0];
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

app.use(express.static(__dirname));

app.get('/', async (req, res) => {
    try {
        const stats = await getScamStatistics();
        
        fs.readFile('index.html', 'utf8', (err, data) => {
            if (err) {
                console.error("Failed to read index.html", err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Replacing placeholders with real data
            data = data.replace("{{total-loss}}", stats.totalLoss);
            data = data.replace("{{numbers-of-reports}}", stats.numberOfReports);
            data = data.replace("{{age-over-65}}", stats.ageOver65);

            res.send(data);
        });
    } catch (err) {
        console.error("Failed to get statistics", err);
        res.status(500).send('Failed to fetch the data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

process.on('SIGTERM', sql.close);
process.on('exit', sql.close);
