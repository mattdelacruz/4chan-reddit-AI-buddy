const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors({ origin: '*' })); // Allow CORS (use specific origin in production)
app.use(express.json());

app.post('/log', (req, res) => {
    const logData = req.body;
    console.log('Log received:', logData); // Log to console
    // Optionally, save to a file
    fs.appendFileSync('original_logs.jsonl', `${JSON.stringify(logData)}\n`);
    res.status(200).json({ message: 'Log received' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));