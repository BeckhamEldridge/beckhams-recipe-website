// Add event listener for the custom file button
console.log('cmCategoryUtils loaded');

export function addCustomFileButtonClickListener(customFileButtonId, categoryImageId) {
  const customFileButton = document.getElementById(customFileButtonId);
  const categoryImage = document.getElementById(categoryImageId);
  customFileButton.addEventListener('click', () => categoryImage.click());
}

export function validateForm(categories) {
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
export function handleFileSelection(fileInput, fileNameElement, imagePreviewElement) {
  fileInput.addEventListener('change', function () {
      const selectedFile = fileInput.files[0];
      
      // Update file name
      if (selectedFile) {
          fileNameElement.textContent = selectedFile.name;
      } else {
          fileNameElement.textContent = 'No file selected';
      }

      // Display image preview if it's an image file
      if (selectedFile && selectedFile.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = function (e) {
              imagePreviewElement.src = e.target.result;
              imagePreviewElement.style.display = 'block';
          };
          reader.readAsDataURL(selectedFile);
      } else {
          imagePreviewElement.style.display = 'none';
      }
  });
}
