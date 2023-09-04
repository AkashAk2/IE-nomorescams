const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const winston = require('winston');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Setup winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Database configuration
const config = {
    user: 'team27@fit5120server',
    password: 'Monash@27', // Replace with your actual password
    server: 'fit5120server.database.windows.net',
    database: 'fit5120-db',
    options: {
        encrypt: true // Azure SQL Database always requires encryption
    }
};

// Middlewares
app.use(cors());
app.use(express.static(__dirname));

// Route for fetching scam statistics
app.get('/scam_statistics', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM scam_loss_statistics');
        await pool.close();

        const jsonResult = JSON.stringify(result.recordset);
        res.send(jsonResult);
    } catch (err) {
        logger.error(`SQL error: ${err}`);
        res.status(500).send('Failed to connect to the database');
    }
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error(`Error occurred: ${err.message}`);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});

// Handle app termination gracefully
process.on('SIGTERM', () => {
    sql.close();
    logger.info('App terminated, SQL connection closed');
});

process.on('exit', () => {
    sql.close();
    logger.info('App exited, SQL connection closed');
});
