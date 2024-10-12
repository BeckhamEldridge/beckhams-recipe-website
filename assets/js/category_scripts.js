// category_scripts.js

// Add event listener for the custom file button
document.getElementById('custom-file-button').addEventListener('click', function () {
    document.getElementById('category-image').click();
});

// Validation function to keep your logic reusable
function validateForm(categories) {
    const categoryName = document.getElementById('category-name').value.trim();
    const categoryImage = document.getElementById('category-image').files[0];
    const categoryNameErrorMessage = document.getElementById('category-name-error-message');
    const imageErrorMessage = document.getElementById('image-error-message');
    const categoryInput = document.getElementById('category-name');
    
    // Reset error styles and messages
    categoryInput.classList.remove('input-error');
    categoryNameErrorMessage.style.display = 'none';
    categoryNameErrorMessage.textContent = '';
    imageErrorMessage.style.display = 'none';
    imageErrorMessage.textContent = '';

    // Step 1: Check if the category name is between 3 and 50 characters
    if (categoryName.length < 3 || categoryName.length > 50) {
        categoryNameErrorMessage.textContent = 'Category name must be between 3 and 50 characters long.';
        categoryNameErrorMessage.style.display = 'block';
        categoryInput.classList.add('input-error');
        return false; // Validation failed
    }

    // Step 2: Validate category name characters (only letters, numbers, spaces, dashes, underscores)
    const categoryNameRegex = /^[a-zA-Z0-9\s-_,]+$/; // Regex pattern for allowed characters
    if (!categoryNameRegex.test(categoryName)) {
        categoryNameErrorMessage.textContent = 'Category name contains invalid characters. Only letters, numbers, spaces, dashes (-), commas, and underscores (_) are allowed.';
        categoryNameErrorMessage.style.display = 'block';
        categoryInput.classList.add('input-error');
        return false; // Validation failed
    }

    // Step 3: Check if an image is selected
    if (!categoryImage) {
        imageErrorMessage.textContent = 'Please select an image.';
        imageErrorMessage.style.display = 'block';
        return false; // Validation failed
    }

    // Step 4: Verify the image is of a valid type (JPEG, PNG, or GIF)
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(categoryImage.type)) {
        imageErrorMessage.textContent = 'Please select a valid image file (JPEG, PNG, or GIF).';
        imageErrorMessage.style.display = 'block';
        return false; // Validation failed
    }

    // Step 5: Check if the category name already exists
    const categoryExists = categories.some(category => category.CategoryName.toLowerCase() === categoryName.toLowerCase());
    if (categoryExists) {
        categoryNameErrorMessage.textContent = 'Category name already exists. Please choose a different name.';
        categoryNameErrorMessage.style.display = 'block';
        return false; // Validation failed
    }

    return true; // All validation passed
}

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
    fetch('/data/jsonfiles/categories.json') // Point to static JSON file on Netlify
        .then(response => response.json())
        .then(data => {
            const categoryList = document.getElementById('category-list');
            categoryList.innerHTML = ''; // Clear existing entries

            // Populate the table with category data
            data.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><i class="fas fa-pencil-alt edit-icon"></i></td>
                    <td>${category.CategoryName}</td>
                    <td><img src="./assets/images/${category.CategoryImage}" class="category-image"></td>
                `;
                categoryList.appendChild(row);
            });

            setupImageClickHandlers(); // Re-setup lightbox for images
        })
        .catch(error => console.error('Error loading categories:', error));
}

// Call the loadCategories function to populate the table
loadCategories();

// Main form submission logic
document.getElementById('add-category-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    try {
        const response = await fetch('/data/jsonfiles/categories.json');
        const categories = await response.json();

        // First, validate the form
        if (!validateForm(categories)) {
            return; // Stop submission if validation fails
        }

        // Continue with form submission logic if validation passes
        const categoryName = document.getElementById('category-name').value.trim();
        const categoryImage = document.getElementById('category-image').files[0];
        const formData = new FormData();

        formData.append('CategoryName', categoryName);
        formData.append('CategoryImage', categoryImage);

        // Submit data using fetch API
        const result = await fetch('/api/categories', {
            method: 'POST',
            body: formData
        });

        const data = await result.json();

        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Category added successfully!');

            // Refresh the categories list and reset the form
            loadCategories();
            document.getElementById('add-category-form').reset();
            document.getElementById('file-name').textContent = 'No file selected';
            document.getElementById('image-preview').style.display = 'none';
        }
    } catch (error) {
        console.error('Error adding category:', error);
        alert('An error occurred while adding the category.');
    }
});