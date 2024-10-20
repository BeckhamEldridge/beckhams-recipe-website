export function handleFormSubmission(formId, validateFormFn, loadCategoriesFn, successMessage, errorMessage) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/data/jsonfiles/categories.json');
            const categories = await response.json();
            // Validate the form
            if (!validateFormFn(categories)) {
                return; // Stop submission if validation fails
            }

            // Continue with form submission logic (fetch API call etc.)
            const categoryName = document.getElementById('category-name').value.trim();
            const categoryImage = document.getElementById('category-image').files[0];
            const formData = new FormData();

            formData.append('CategoryName', categoryName);
            formData.append('CategoryImage', categoryImage);

            const result = await fetch('/api/categories', {
                method: 'POST',
                body: formData
            });

            const data = await result.json();
            if (data.error) {
                alert('Error: ' + data.error);
            } else {
                alert(successMessage);
                // loadCategoriesFn();
                loadCategoriesFn('category-list', 'fas fa-pencil-alt edit-icon', 'category-image');
                // Reset the form
                document.getElementById('add-category-form').reset();
                document.getElementById('file-name').textContent = 'No file selected';
                document.getElementById('image-preview').style.display = 'none';
            }
        } catch (error) {
            console.error('Error adding category:', error);
            alert(errorMessage);
        }
    });
}

export function handleEditFormSubmission(formId, validateFormFn, loadCategoriesFn, successMessage, errorMessage) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            // Fetch categories to validate if needed
            const response = await fetch('/data/jsonfiles/categories.json');
            const categories = await response.json();

            // Validate the form (reuse the validation logic)
            if (!validateFormFn(categories)) {
                return; // Stop submission if validation fails
            }

            // Get updated form data
            const categoryName = document.getElementById('edit-category-name').value.trim();
            const categoryImage = document.getElementById('edit-category-image').files[0]; // Check if a new image is uploaded
            const categoryId = document.getElementById('edit-category-id').value;

            const formData = new FormData();
            formData.append('CategoryName', categoryName);
            if (categoryImage) {
                formData.append('CategoryImage', categoryImage); // Add only if a new image is selected
            }

            // Send PATCH request to the new endpoint with category ID
            const result = await fetch(`/api/categories/${categoryId}`, {
                method: 'PATCH',
                body: formData
            });

            const data = await result.json();
            if (data.error) {
                alert('Error: ' + data.error);
            } else {
                alert(successMessage);
                // Reload the categories list
                loadCategoriesFn('category-list', 'fas fa-pencil-alt edit-icon', 'category-image');
                // Reset the form
                document.getElementById(formId).reset();
                document.getElementById('edit-file-name').textContent = 'No file selected';
                document.getElementById('edit-image-preview').style.display = 'none';
            }
        } catch (error) {
            console.error('Error updating category:', error);
            alert(errorMessage);
        }
    });
}
