// Import your functions
import { addCustomFileButtonClickListener } from '/assets/js/categoryManagement/cmCategoryUtils.js';
import { validateForm } from '/assets/js/categoryManagement/cmCategoryUtils.js';
import { handleFileSelection } from '/assets/js/categoryManagement/cmCategoryUtils.js';
import { loadCategories } from '/assets/js/categoryManagement/cmCategoryUI.js';
import { handleFormSubmission } from '/assets/js/categoryManagement/cmCategoryForm.js';

// Call your functions
addCustomFileButtonClickListener('custom-file-button', 'category-image');
// Handle file selection
handleFileSelection(
    document.getElementById('category-image'),
    document.getElementById('file-name'),
    document.getElementById('image-preview')
);

// Load categories
loadCategories(
    'category-list', // ID of the category list element
    'fas fa-pencil-alt edit-icon', // Class for the edit icon
    'category-image' // Class for the category image
);

// Handle form submission
handleFormSubmission(
    'add-category-form',
    validateForm,
    loadCategories,
    'Category added successfully!',
    'An error occurred while adding the category.'
);