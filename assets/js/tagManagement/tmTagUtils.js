// Add event listener for the custom file button
console.log('tmTagUtils loaded');

export function addCustomFileButtonClickListener(customFileButtonId, tagImageId) {
  const customFileButton = document.getElementById(customFileButtonId);
  const tagImage = document.getElementById(tagImageId);
  customFileButton.addEventListener('click', () => tagImage.click());
}

export function validateForm(tags, formConfig) {

  const tagName = document.getElementById(formConfig.tagNameId).value.trim();
  const tagImage = document.getElementById(formConfig.tagImageId).files[0];
  const tagNameErrorMessage = document.getElementById(formConfig.tagNameErrorMessageId);
  const imageErrorMessage = document.getElementById(formConfig.imageErrorMessageId);
  const tagInput = document.getElementById(formConfig.tagNameId);

  // Reset error styles and messages
  tagInput.classList.remove('input-error');
  tagNameErrorMessage.style.display = 'none';
  tagNameErrorMessage.textContent = '';
  imageErrorMessage.style.display = 'none';
  imageErrorMessage.textContent = '';

  // Step 1: Check if the tag name is between 3 and 50 characters
  if (tagName.length < 3 || tagName.length > 50) {
    tagNameErrorMessage.textContent = 'Tag name must be between 3 and 50 characters long.';
    tagNameErrorMessage.style.display = 'block';
    tagInput.classList.add('input-error');
    return false; // Validation failed
  }

  // Step 2: Validate tag name characters (only letters, numbers, spaces, dashes, underscores)
  const tagNameRegex = /^[a-zA-Z0-9\s-_,]+$/; // Regex pattern for allowed characters
  if (!tagNameRegex.test(tagName)) {
    tagNameErrorMessage.textContent = 'Tag name contains invalid characters. Only letters, numbers, spaces, dashes (-), commas, and underscores (_) are allowed.';
    tagNameErrorMessage.style.display = 'block';
    tagInput.classList.add('input-error');
    return false; // Validation failed
  }

  // Step 3: Check if an image is selected
  if (!tagImage) {
    imageErrorMessage.textContent = 'Please select an image.';
    imageErrorMessage.style.display = 'block';
    return false; // Validation failed
  }

  // Step 4: Verify the image is of a valid type (JPEG, PNG, or GIF)
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!validImageTypes.includes(tagImage.type)) {
    imageErrorMessage.textContent = 'Please select a valid image file (JPEG, PNG, or GIF).';
    imageErrorMessage.style.display = 'block';
    return false; // Validation failed
  }

  // Step 5: Check if the tag name already exists
  const tagExists = tags.some(tag => tag.TagName.toLowerCase() === tagName.toLowerCase());
  if (tagExists) {
    tagNameErrorMessage.textContent = 'Tag name already exists. Please choose a different name.';
    tagNameErrorMessage.style.display = 'block';
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