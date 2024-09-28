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

console.log("Website is loaded!");