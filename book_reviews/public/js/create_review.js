let checkboxes = document.querySelectorAll(".star");

function updateStars(checkbox) {
    let id = checkbox.id;

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