const sortMethodSelection = document.querySelector("#sort-menu");
const sortReviews = new CustomEvent('sortreviews');

if(!localStorage.getItem("sort_method")) {
    localStorage.setItem("sort_method", "highest_rated");
}

sortMethodSelection.addEventListener("change", e => {
    let sortMenu = e.target;
    
    for(const option of sortMenu.children) {
        if(option.selected) {
            localStorage.setItem("sort_method", option.value);
        }
    }

    window.dispatchEvent(sortReviews);
});

