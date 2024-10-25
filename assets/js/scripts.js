document.addEventListener("DOMContentLoaded", function () {
    const tabContainer = document.querySelector(".tab-content");

    if (tabContainer) {
        tabContainer.addEventListener("click", function (event) {
            if (event.target.classList.contains("tab-link")) {
                openTab(event, event.target.getAttribute("data-tab"));
            }
        });

        // Automatically open the first tab on page load
        document.querySelector(".tab-link").click();
    } else {
        console.error("Tab container not found!");
    }
});

function openTab(event, tabName) {
    // Hide all tab content
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
        tabContents[i].classList.remove("active");
    }

    // Remove the active class from all tabs
    const tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    // Show the current tab content and add "active" class to the clicked tab
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    event.currentTarget.classList.add("active");
}

window.onload = function () {
    const hostname = window.location.hostname;

    // If running locally (localhost or 127.0.0.1), show the Admin tab
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        document.querySelector('.manage-tab').style.display = 'inline-block'; // Show Manage tab
        document.querySelector('.admin-tab').style.display = 'inline-block'; // Show Admin tab
    }

    // Tab switching functionality
    function openTab(evt, tabName) {
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        //document.getElementById(tabName).classList.add('active');

        const tabLinks = document.querySelectorAll('.tab-link');
        tabLinks.forEach(link => link.classList.remove('active'));
        evt.currentTarget.classList.add('active');
    }

    // Add event listener to each tab-link element
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function (e) {
            openTab(e, tab.dataset.tab);
        });
    });

    // Fetch and display categories
    fetch('/api/categories')
        .then(response => response.json())
        .then(categories => {
            const categoryList = document.getElementById('category-list');
            if (categoryList) {
                categories.forEach(category => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = `/category/${category.CategoryID}`; // Link to category page
                    link.textContent = category.CategoryName;
                    listItem.appendChild(link);
                    categoryList.appendChild(listItem);
                });
            }
        })
        .catch(error => console.error('Error fetching categories:', error));

    // Fetch and display tags
    fetch('/api/tags')
        .then(response => response.json())
        .then(tags => {
            const tagList = document.getElementById('tag-list');
            if (tagList) {
                tags.forEach(tag => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = `/tag/${tag.TagID}`; // Link to tag page
                    link.textContent = tag.TagName;
                    listItem.appendChild(link);
                    tagList.appendChild(listItem);
                });
            }
        })
        .catch(error => console.error('Error fetching tags:', error));

    // Button event listener for generating the Category JSON
    const generateButton = document.getElementById('generate-json-button');
    if (generateButton) {
        generateButton.addEventListener('click', function () {
            fetch('/generate-category-json')
                .then(response => response.text())
                .then(data => {
                    alert('Categories JSON file generated successfully.');
                    console.log(data); // Logs server response
                })
                .catch(error => {
                    console.error('Error generating JSON:', error);
                    alert('Failed to generate JSON.');
                });
        });
    }

    // Button event listener for generating the Tag JSON
    const generateTagButton = document.getElementById('generate-tag-json-button');
    if (generateTagButton) {
        generateTagButton.addEventListener('click', function () {
            fetch('/generate-tag-json')
                .then(response => response.text())
                .then(data => {
                    alert('Tags JSON file generated successfully.');
                    console.log(data); // Logs server response
                })
                .catch(error => {
                    console.error('Error generating JSON:', error);
                    alert('Failed to generate JSON.');
                });
        });
    }
};

console.log("Website is loaded!");