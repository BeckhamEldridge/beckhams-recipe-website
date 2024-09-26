// Function to handle tab navigation
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

// Automatically open the first tab on page load
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".tab-link").click();

    async function fetchCategories() {
        const { data, error } = await supabase
            .from('Categories')
            .select('*');

        if (error) {
            console.error(error);
        } else {
            // Log each category individually
            data.forEach((category, index) => {
                console.log(`Category ${index + 1}:`, category);
            });
        }
    }

    // Fetch categories once the DOM is fully loaded
    fetchCategories();
});

console.log("Website is loaded!");
