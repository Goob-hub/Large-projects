const navBtn = document.querySelector("#nav-btn");
let navMenu = document.querySelector("#nav-menu");

navBtn.addEventListener("click", e => {
    let openTimeout = 300;

    navBtn.classList.toggle("open");
    navMenu.classList.toggle("open");
    navMenu.classList.toggle("hidden");

    if(navBtn.classList.contains("open")) {
        for (const htmlEl of navMenu.children) {
            setTimeout(() => {
                htmlEl.classList.toggle("off");
            }, openTimeout += 100);
        }
    } else {
        for (const htmlEl of navMenu.children) {
            htmlEl.classList.toggle("off");
        }
    }
});

