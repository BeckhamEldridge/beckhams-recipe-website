export function handleFormSubmission(formId, validateFormFn, loadCategoriesFn, successMessage, errorMessage) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/data/jsonfiles/tags.json');
            const tags = await response.json();
            // Validate the form
            if (!validateFormFn(tags)) {
                return; // Stop submission if validation fails
            }

            // Continue with form submission logic (fetch API call etc.)
            const tagName = document.getElementById('tag-name').value.trim();
            const tagImage = document.getElementById('tag-image').files[0];
            const formData = new FormData();

            formData.append('TagName', tagName);
            formData.append('TagImage', tagImage);

            const result = await fetch('/api/tags', {
                method: 'POST',
                body: formData
            });

            const data = await result.json();
            if (data.error) {
                alert('Error: ' + data.error);
            } else {
                alert(successMessage);
                // loadCategoriesFn();
                loadCategoriesFn('tag-list', 'fas fa-pencil-alt edit-icon', 'tag-image','fas fa-trash delete-icon');
                // Reset the form
                document.getElementById('add-tag-form').reset();
                document.getElementById('file-name').textContent = 'No file selected';
                document.getElementById('image-preview').style.display = 'none';
            }
        } catch (error) {
            console.error('Error adding tag:', error);
            alert(errorMessage);
        }
    });
}

export function handleEditFormSubmission(formId, validateFormFn, loadCategoriesFn, successMessage, errorMessage) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            // Fetch tags to validate if needed
            const response = await fetch('/data/jsonfiles/tags.json');
            const tags = await response.json();

            // Validate the form (reuse the validation logic)
            if (!validateFormFn(tags)) {
                return; // Stop submission if validation fails
            }

            // Get updated form data
            const tagName = document.getElementById('edit-tag-name').value.trim();
            const tagImage = document.getElementById('edit-tag-image').files[0]; // Check if a new image is uploaded
            const tagId = document.getElementById('edit-tag-id').value;

            const formData = new FormData();
            formData.append('TagName', tagName);
            if (tagImage) {
                formData.append('TagImage', tagImage); // Add only if a new image is selected
            }

            // Send PATCH request to the new endpoint with tag ID
            const result = await fetch(`/api/tags/${tagId}`, {
                method: 'PATCH',
                body: formData
            });

            const data = await result.json();
            if (data.error) {
                alert('Error: ' + data.error);
            } else {
                alert(successMessage);
                // Reload the tags list
                loadCategoriesFn('tag-list', 'fas fa-pencil-alt edit-icon', 'tag-image','fas fa-trash delete-icon');
                // Reset the form
                document.getElementById(formId).reset();
                document.getElementById('edit-file-name').textContent = 'No file selected';
                document.getElementById('edit-image-preview').style.display = 'none';
            }
        } catch (error) {
            console.error('Error updating tag:', error);
            alert(errorMessage);
        }
    });
}
