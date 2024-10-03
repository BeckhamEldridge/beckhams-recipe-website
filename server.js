const express = require('express');
const app = express();

// Middleware to serve static files (optional)
app.use(express.static(__dirname));  // Serve static files from root directory

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');  // Serve the index.html from the root directory
});

// Route for retrieving recipes (Example)
app.get('/recipes', (req, res) => {
  res.json([{ id: 1, name: 'Pasta' }, { id: 2, name: 'Pizza' }]);  // Send JSON
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
