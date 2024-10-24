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
    const sql = 'SELECT CategoryID, CategoryName, CategoryImage FROM Categories ORDER BY CategoryName';

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
    const sql = 'SELECT CategoryID, CategoryName, CategoryImage FROM Categories ORDER BY CategoryName';

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

// Route to get a category by ID
app.get('/api/categories/:id', (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters
    const sql = 'SELECT CategoryID, CategoryName, CategoryImage FROM Categories WHERE CategoryID = ?';

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error:', err.message);
            return res.status(500).json({ error: 'Error retrieving the category' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(row); // Send the category details as JSON
    });
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

// PATCH endpoint to update an existing category
app.patch('/api/categories/:id', upload.single('CategoryImage'), (req, res) => {
    const { CategoryName } = req.body;
    const CategoryImage = req.file ? req.file.filename : null;
    const { id } = req.params;

    if (!CategoryName) {
        return res.status(400).json({ error: "CategoryName is required" });
    }

    // Prepare SQL query with conditional update for the image
    let sql = 'UPDATE Categories SET CategoryName = ?';
    const params = [CategoryName];

    if (CategoryImage) {
        sql += ', CategoryImage = ?';
        params.push(CategoryImage);
    }

    sql += ' WHERE CategoryID = ?'; // Ensure you're using CategoryID to update the correct record
    params.push(id);

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // After updating the category, regenerate the JSON file
        generateCategoryJson(() => {
            res.json({
                message: 'Category updated successfully',
                data: { id, CategoryName, CategoryImage }
            });
        });
    });
});

// Route for deleting a category
app.delete('/api/categories/:id', (req, res) => {
    const { id } = req.params;

    // Proceed directly with the deletion of the category
    const deleteSql = 'DELETE FROM Categories WHERE CategoryID = ?';

    db.run(deleteSql, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error deleting category' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // After deletion, regenerate the JSON file
        generateCategoryJson(() => {
            res.json({ message: 'Category deleted successfully' });
        });
    });
});

function generateCategoryJson(callback) {
    const sql = 'SELECT CategoryID, CategoryName, CategoryImage FROM Categories ORDER BY CategoryName';

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

// Route for retrieving tags
app.get('/api/tags', (req, res) => {
    const sql = 'SELECT TagID, TagName, TagImage FROM Tags ORDER BY TagName';

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows); // Send the tags as JSON
    });
});

// Route for inserting a new tag into the database
app.post('/api/tags', upload.single('TagImage'), (req, res) => {
    const { TagName } = req.body;
    const TagImage = req.file ? req.file.filename : null;

    if (!TagName || !TagImage) {
        return res.status(400).json({ error: "TagName and TagImage are required" });
    }

    const sql = 'INSERT INTO Tags (TagName, TagImage) VALUES (?, ?)';
    const params = [TagName, TagImage];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // After inserting the new tag, regenerate the JSON file
        generateTagJson(() => {
            res.json({
                message: 'Tag added successfully',
                data: { id: this.lastID, TagName, TagImage }
            });
        });
    });
});

// Function to write tags to JSON file
app.get('/generate-tag-json', (req, res) => {
    const sql = 'SELECT TagID, TagName, TagImage FROM Tags ORDER BY TagName';

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const dirPath = path.join(__dirname, 'data', 'jsonfiles'); // Path to the directory
        const filePath = path.join(dirPath, 'tags.json'); // Path to the JSON file

        // Ensure the directory exists, if not, create it
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true }); // Create directory recursively if it doesn't exist
        }

        fs.writeFile(filePath, JSON.stringify(rows, null, 2), (err) => {
            if (err) throw err;
            console.log('Tags data written to JSON file.');
            res.send('Tags JSON generated');
        });
    });
});

// Route to get a tag by ID
app.get('/api/tags/:id', (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters
    const sql = 'SELECT TagID, TagName, TagImage FROM Tags WHERE TagID = ?';

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error:', err.message);
            return res.status(500).json({ error: 'Error retrieving the tag' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        res.json(row); // Send the tag details as JSON
    });
});

// PATCH endpoint to update an existing tag
app.patch('/api/tags/:id', upload.single('TagImage'), (req, res) => {
    const { TagName } = req.body;
    const TagImage = req.file ? req.file.filename : null;
    const { id } = req.params;

    if (!TagName) {
        return res.status(400).json({ error: "TagName is required" });
    }

    // Prepare SQL query with conditional update for the image
    let sql = 'UPDATE Tags SET TagName = ?';
    const params = [TagName];

    if (TagImage) {
        sql += ', TagImage = ?';
        params.push(TagImage);
    }

    sql += ' WHERE TagID = ?'; // Ensure you're using TagID to update the correct record
    params.push(id);

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // After updating the tag, regenerate the JSON file
        generateTagJson(() => {
            res.json({
                message: 'Tag updated successfully',
                data: { id, TagName, TagImage }
            });
        });
    });
});

// Route for deleting a tag
app.delete('/api/tags/:id', (req, res) => {
    const { id } = req.params;

    // Proceed directly with the deletion of the tag
    const deleteSql = 'DELETE FROM Tags WHERE TagID = ?';

    db.run(deleteSql, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error deleting tag' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        // After deletion, regenerate the JSON file
        generateTagJson(() => {
            res.json({ message: 'Tag deleted successfully' });
        });
    });
});

function generateTagJson(callback) {
    const sql = 'SELECT TagID, TagName, TagImage FROM Tags ORDER BY TagName';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error generating tag JSON:', err.message);
            return callback(err);
        }

        const dirPath = path.join(__dirname, 'data', 'jsonfiles');
        const filePath = path.join(dirPath, 'tags.json');

        // Ensure the directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFile(filePath, JSON.stringify(rows, null, 2), (err) => {
            if (err) {
                console.error('Error writing JSON file:', err.message);
                return callback(err);
            }
            console.log('Tags data written to JSON file.');
            callback();
        });
    });
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});