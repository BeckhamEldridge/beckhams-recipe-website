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

export function loadCategories(categoryListId, editIconClass, categoryImageClass) {
    fetch('/data/jsonfiles/categories.json')
        .then(response => response.json())
        .then(data => {
            const categoryList = document.getElementById(categoryListId);
            categoryList.innerHTML = '';

            data.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><i class="${editIconClass}"></i></td>
                    <td>${category.CategoryName}</td>
                    <td><img src="/assets/images/${category.CategoryImage}" class="${categoryImageClass}"></td>
                `;
                categoryList.appendChild(row);
            });

            setupImageClickHandlers(
                '.' + categoryImageClass, // Select all thumbnails
                'lightbox',
                'lightbox-img',
                'close-lightbox'
            );
        })
        .catch(error => console.error('Error loading categories:', error));
}