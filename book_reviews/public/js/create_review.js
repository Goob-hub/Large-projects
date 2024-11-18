let checkboxes = document.querySelectorAll(".checkbox-star");
let starRating = document.querySelector("#current-rating");
let dateInput = document.querySelector(".date-input");

let currentDate = new Date();
let day = currentDate.getDate();
let month = currentDate.getMonth() + 1;
let year = currentDate.getFullYear();
let formattedDate =  year + "-" + month + "-" + day;

dateInput.max = formattedDate;

function updateStars(checkbox) {
    let id = checkbox.id;
    starRating.textContent = id;

    checkboxes.forEach(checkbox => {
        if(checkbox.id <= id) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
}

checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", (e) => {
        let el = e.target;
        updateStars(el);
    });
});