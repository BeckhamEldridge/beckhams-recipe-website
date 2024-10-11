const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite3
const app = express();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Middleware to serve static files and parse JSON requests
app.use(express.static(__dirname)); // Serve static files from root directory
app.use(express.json()); // Parse JSON request bodies

// Connect to SQLite Database
const db = new sqlite3.Database('./data/recipes.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Set up Multer for handling image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './assets/images/'); // Directory for saving images
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Save the image with its original name
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (validImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
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

// Route for inserting a new category into the database
app.post('/api/categories', upload.single('CategoryImage'), (req, res) => {
    const { CategoryName } = req.body;
    const CategoryImage = req.file ? req.file.filename : null;

    if (!CategoryName || !CategoryImage) {
        return res.status(400).json({ error: "CategoryName and CategoryImage are required" });
    }

    const sql = 'INSERT INTO Categories (CategoryName, CategoryImage) VALUES (?, ?)';
    const params = [CategoryName, CategoryImage];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // After inserting the new category, regenerate the JSON file
        generateCategoryJson(() => {
            res.json({
                message: 'Category added successfully',
                data: { id: this.lastID, CategoryName, CategoryImage }
            });
        });
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

function generateCategoryJson(callback) {
    const sql = 'SELECT CategoryName, CategoryImage FROM Categories ORDER BY CategoryName';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error generating category JSON:', err.message);
            return callback(err);
        }

        const dirPath = path.join(__dirname, 'data', 'jsonfiles');
        const filePath = path.join(dirPath, 'categories.json');

        // Ensure the directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFile(filePath, JSON.stringify(rows, null, 2), (err) => {
            if (err) {
                console.error('Error writing JSON file:', err.message);
                return callback(err);
            }
            console.log('Categories data written to JSON file.');
            callback();
        });
    });
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
