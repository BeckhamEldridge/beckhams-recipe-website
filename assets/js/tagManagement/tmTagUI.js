export function setupImageClickHandlers(thumbnailsSelector, lightboxId, lightboxImgId, closeLightboxId) {
    const thumbnails = document.querySelectorAll(thumbnailsSelector);
    const lightbox = document.getElementById(lightboxId);
    const lightboxImg = document.getElementById(lightboxImgId);
    const closeLightbox = document.getElementById(closeLightboxId);

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            lightboxImg.src = thumbnail.src;
            lightbox.style.display = 'flex';
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
}

export function loadCategories(tagListId, editIconClass, tagImageClass, deleteIconClass) {
    fetch('/data/jsonfiles/tags.json')
        .then(response => response.json())
        .then(data => {
            const tagList = document.getElementById(tagListId);
            tagList.innerHTML = '';

            data.forEach(tag => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><i class="${editIconClass}"></i></td>
                    <td>${tag.TagID}</td>
                    <td>${tag.TagName}</td>
                    <td><img src="/assets/images/${tag.TagImage}" class="${tagImageClass}"></td>
                    <td><i class="${deleteIconClass}" data-tag-id="${tag.TagID}"></i></td>
                `;
                tagList.appendChild(row);

                // Add edit functionality
                const editIcon = row.querySelector(`.${editIconClass.split(' ').join('.')}`);
                editIcon.addEventListener('click', () => {
                    // Populate the edit form with the selected row's data
                    document.getElementById('edit-tag-name').value = tag.TagName;
                    document.getElementById('edit-image-preview').src = `/assets/images/${tag.TagImage}`;
                    document.getElementById('edit-image-preview').style.display = 'block';
                    document.getElementById('edit-tag-id').value = tag.TagID;
                    document.getElementById('edit-file-name').textContent = tag.TagImage;
                });


                // Add delete functionality
                const deleteIcon = row.querySelector(`.${deleteIconClass.split(' ').join('.')}`);
                deleteIcon.addEventListener('click', () => {
                    const tagId = tag.TagID;

                    // Confirm deletion
                    if (confirm(`Are you sure you want to delete the tag "${tag.TagName}"? This action cannot be undone.`)) {
                        fetch(`/api/tags/${tagId}`, {
                            method: 'DELETE',
                        })
                            .then(response => response.json())
                            .then(result => {
                                if (result.error) {
                                    alert(result.error);
                                } else {
                                    alert(result.message);
                                    loadCategories(tagListId, editIconClass, tagImageClass, deleteIconClass); // Reload the tags
                                }
                            })
                            .catch(error => {
                                console.error('Error deleting tag:', error);
                            });
                    }
                });
            });

            // Setup the image click handlers
            setupImageClickHandlers(
                '.' + tagImageClass, // Select all thumbnails
                'lightbox',
                'lightbox-img',
                'close-lightbox'
            );
        })
        .catch(error => console.error('Error loading tags:', error));
}