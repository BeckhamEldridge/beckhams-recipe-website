// JavaScript file to handle future interactivity
console.log("Website is loaded!");

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
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tab-link").click();
});

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchCategories() {
    const { data, error } = await supabase
        .from('Categories')
        .select('*');
    if (error) console.error(error);
    else console.log(data);
}

fetchCategories();