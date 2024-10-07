// category_scripts.js

// Add event listener for the custom file button
document.getElementById('custom-file-button').addEventListener('click', function () {
    document.getElementById('category-image').click();
});

// Handle file selection and show file name + thumbnail
document.getElementById('category-image').addEventListener('change', function () {
    const fileInput = document.getElementById('category-image');
    const fileName = document.getElementById('file-name');
    const imagePreview = document.getElementById('image-preview');

    // Display the file name
    const selectedFile = fileInput.files[0];
    fileName.textContent = selectedFile ? selectedFile.name : 'No file selected';

    // Show image thumbnail if a file is selected and it's an image
    if (selectedFile && selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; // Show the image preview
        };
        reader.readAsDataURL(selectedFile);
    } else {
        imagePreview.style.display = 'none'; // Hide the image preview if no image is selected
    }
});

// Function to handle image click for lightbox
function setupImageClickHandlers() {
    const thumbnails = document.querySelectorAll('.category-image'); // Select all thumbnails
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.getElementById('close-lightbox');

    // Add click event listener for each thumbnail
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            lightboxImg.src = thumbnail.src; // Set lightbox image source to thumbnail source
            lightbox.style.display = 'flex'; // Show the lightbox
        });
    });

    // Close the lightbox when clicking the close button
    closeLightbox.addEventListener('click', function () {
        lightbox.style.display = 'none'; // Hide the lightbox
    });

    // Close the lightbox when clicking outside the image
    lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            lightbox.style.display = 'none'; // Hide the lightbox
        }
    });
}

// Call the setupImageClickHandlers function after categories are loaded
function loadCategories() {
    fetch('/api/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const categoryList = document.getElementById('category-list');
            categoryList.innerHTML = ''; // Clear existing entries

            // Populate the table with category data
            data.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><i class="fas fa-pencil-alt edit-icon" onclick="editCategory(${category.id})"></i></td>
                    <td>${category.CategoryName}</td>
                    <td><img src="./assets/images/${category.CategoryImage}" class="category-image" alt="${category.CategoryName}"></td>
                `;
                categoryList.appendChild(row);
            });

            // Setup the lightbox after the categories are loaded
            setupImageClickHandlers();
        })
        .catch(error => console.error('Error loading categories:', error));
}

// Call the loadCategories function to populate the table
loadCategories();

// Form submission logic
document.getElementById('add-category-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const categoryName = document.getElementById('category-name').value;
    const categoryImage = document.getElementById('category-image').files[0];

    alert(`Category Name: ${categoryName}\nSelected Image: ${categoryImage ? categoryImage.name : 'No image selected'}`);

    // Add your form submission logic here
});