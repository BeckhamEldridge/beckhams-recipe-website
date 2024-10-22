// Import your functions
import { addCustomFileButtonClickListener } from '/assets/js/tagManagement/tmTagUtils.js';
import { validateForm } from '/assets/js/tagManagement/tmTagUtils.js';
import { handleFileSelection } from '/assets/js/tagManagement/tmTagUtils.js';
import { loadCategories } from '/assets/js/tagManagement/tmTagUI.js';
import { handleFormSubmission } from '/assets/js/tagManagement/tmTagForm.js';
import { handleEditFormSubmission } from '/assets/js/tagManagement/tmTagForm.js';

// Call your functions
addCustomFileButtonClickListener('custom-file-button', 'tag-image');
// Handle file selection
handleFileSelection(
    document.getElementById('tag-image'),
    document.getElementById('file-name'),
    document.getElementById('image-preview')
);

// Load tags
loadCategories(
    'tag-list', // ID of the tag list element
    'fas fa-pencil-alt edit-icon', // Class for the edit icon
    'tag-image', // Class for the tag image
    'fas fa-trash delete-icon', // Class for the edit icon
);

// Handle form submission
handleFormSubmission(
    'add-tag-form',
    (tags) => validateForm(tags, {
        tagNameId: 'tag-name',
        tagImageId: 'tag-image',
        tagNameErrorMessageId: 'tag-name-error-message',
        imageErrorMessageId: 'image-error-message',
        requireImage: true // Image is required for the add form
    }),
    loadCategories,
    'Tag added successfully!',
    'An error occurred while adding the tag.'
);

handleEditFormSubmission(
    'edit-tag-form',
    (tags) => validateForm(tags, {
        tagNameId: 'edit-tag-name',
        tagImageId: 'edit-tag-image',
        tagNameErrorMessageId: 'edit-tag-name-error-message',
        imageErrorMessageId: 'edit-image-error-message',
        requireImage: true // Image is required for the add form
    }),
    loadCategories, // Reuse the tag loading function
    'Tag updated successfully!',
    'An error occurred while updating the tag.'
);

addCustomFileButtonClickListener('edit-file-button', 'edit-tag-image');
// Handle file selection
handleFileSelection(
    document.getElementById('edit-tag-image'),
    document.getElementById('edit-file-name'),
    document.getElementById('edit-image-preview')
);