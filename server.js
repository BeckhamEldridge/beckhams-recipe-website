const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite3
const app = express();
const fs = require('fs');
const path = require('path');

// Middleware to serve static files
app.use(express.static(__dirname)); // Serve static files from root directory

// Connect to SQLite Database
const db = new sqlite3.Database('./data/recipes.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Serve the index.html from the root directory
});

// Route for retrieving categories
app.get('/api/categories', (req, res) => {
    const sql = 'SELECT CategoryName, CategoryImage FROM Categories ORDER BY CategoryName';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows); // Send the categories as JSON
    });
});

// Function to write categories to JSON file
app.get('/generate-category-json', (req, res) => {
    const sql = 'SELECT CategoryName, CategoryImage FROM Categories ORDER BY CategoryName';

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const dirPath = path.join(__dirname, 'data', 'jsonfiles'); // Path to the directory
        const filePath = path.join(dirPath, 'categories.json'); // Path to the JSON file

        // Ensure the directory exists, if not, create it
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true }); // Create directory recursively if it doesn't exist
        }

        fs.writeFile(filePath, JSON.stringify(rows, null, 2), (err) => {
            if (err) throw err;
            console.log('Categories data written to JSON file.');
            res.send('Categories JSON generated');
        });
    });
});


// Route for retrieving recipes (Example)
app.get('/recipes', (req, res) => {
    res.json([{ id: 1, name: 'Pasta' }, { id: 2, name: 'Pizza' }]); // Send JSON
});

// Close the database connection when the server is shut down
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing the database connection:', err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});