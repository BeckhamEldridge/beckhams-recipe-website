// scripts.js

document.getElementById('add-category-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const categoryName = document.getElementById('category-name').value;
    const categoryImage = document.getElementById('category-image').files[0];
    
    // Placeholder for form submission logic (e.g., sending data to SQLite database)
    alert(`Category Name: ${categoryName}\nSelected Image: ${categoryImage ? categoryImage.name : 'No image selected'}`);
    
    // In future, add the logic here to submit the form data to the backend.
});
