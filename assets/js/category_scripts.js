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

// Form submission logic
document.getElementById('add-category-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const categoryName = document.getElementById('category-name').value;
    const categoryImage = document.getElementById('category-image').files[0];

    alert(`Category Name: ${categoryName}\nSelected Image: ${categoryImage ? categoryImage.name : 'No image selected'}`);

    // Add your form submission logic here
});
