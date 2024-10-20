// Import your functions
import { addCustomFileButtonClickListener } from '/assets/js/categoryManagement/cmCategoryUtils.js';
import { validateForm } from '/assets/js/categoryManagement/cmCategoryUtils.js';
import { handleFileSelection } from '/assets/js/categoryManagement/cmCategoryUtils.js';
import { loadCategories } from '/assets/js/categoryManagement/cmCategoryUI.js';
import { handleFormSubmission } from '/assets/js/categoryManagement/cmCategoryForm.js';
import { handleEditFormSubmission } from '/assets/js/categoryManagement/cmCategoryForm.js';

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
    (categories) => validateForm(categories, {
        categoryNameId: 'category-name',
        categoryImageId: 'category-image',
        categoryNameErrorMessageId: 'category-name-error-message',
        imageErrorMessageId: 'image-error-message',
        requireImage: true // Image is required for the add form
    }),
    loadCategories,
    'Category added successfully!',
    'An error occurred while adding the category.'
);

handleEditFormSubmission(
    'edit-category-form',
    (categories) => validateForm(categories, {
        categoryNameId: 'edit-category-name',
        categoryImageId: 'edit-category-image',
        categoryNameErrorMessageId: 'edit-category-name-error-message',
        imageErrorMessageId: 'edit-image-error-message',
        requireImage: true // Image is required for the add form
    }),
    loadCategories, // Reuse the category loading function
    'Category updated successfully!',
    'An error occurred while updating the category.'
);

addCustomFileButtonClickListener('edit-file-button', 'edit-category-image');
// Handle file selection
handleFileSelection(
    document.getElementById('edit-category-image'),
    document.getElementById('edit-file-name'),
    document.getElementById('edit-image-preview')
);