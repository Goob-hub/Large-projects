const sortMethodSelection = document.querySelector("#sort-menu");

let bookReviewContainer = document.querySelector(".book-review-container");
let sortMenu = document.querySelector("#sort-menu");

if(!localStorage.getItem("sort_method")) {
    localStorage.setItem("sort_method", "highest_rated");
}

function sortBookReviews() {
    let sortingMethod = localStorage.getItem("sort_method");
    let reviews = getReviews();
    
    //Sorts book reviews based on user selected sort method
    switch (sortingMethod) {
        case "highest_rated":
            reviews = reviews.sort((a, b) => {
                return b.rating - a.rating;
            });
            changeReviewHtml(reviews);
            break;
        case "lowest_rated":
            reviews = reviews.sort((a, b) => {
                return a.rating - b.rating;
            });
            changeReviewHtml(reviews);
            break;
        default:
            console.error("Could not sort book reviews on this page");
            break;
    }
}

function changeReviewHtml(sortedReviewsArray) {
    if(!sortedReviewsArray) {
        console.error("Did not recieve sorted html in the changeReviewHtml function in sort_reviews.js!");
        return;
    }

    //Emptys current html for sorted html to be added
    bookReviewContainer.innerHTML = "";

    //Makes sure correct dropdown menu value is selected for user feedback
    sortMenu.childNodes.forEach(child => {
        if(child.value === sortingMethod) {
            child.selected = true;
        } else {
            child.selected = false;
        }
    });

    //Injects html of each review in order based on selected sort method
    reviews.forEach(review => {
        bookReviewContainer.innerHTML += review.html
    });
}
                
function getReviews() {
    let reviews = [];
    let bookReviews = document.querySelectorAll(".book-review");
    
    bookReviews.forEach(bookReview => {
        reviews.push({
            html: bookReview.outerHTML,
            rating: parseInt(bookReview.querySelector("#rating").textContent)
        });
    });

    return reviews;
}
                
sortMethodSelection.addEventListener("change", e => {
    let sortMenu = e.target;
    
    for(const option of sortMenu.children) {
        if(option.selected) {
            localStorage.setItem("sort_method", option.value);
        }
    }

    sortBookReviews();
});

sortBookReviews();
