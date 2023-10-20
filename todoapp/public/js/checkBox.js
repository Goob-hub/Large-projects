let taskCheckBoxes = document.querySelectorAll('.form-check-input');

taskCheckBoxes.forEach(checkBox => {
    checkIfTaskIsDone(checkBox);
    checkBox.addEventListener('click', updateAndSubmit);
});


function updateAndSubmit(e) {
    let checkBox = e.target;
    let valueContainer = checkBox.previousElementSibling;
    valueContainer.value = checkBox.checked;
    checkBox.parentNode.submit();
}

function checkIfTaskIsDone(checkBox) {
    let valueContainer = checkBox.previousElementSibling;
    if(valueContainer.value === "true"){
        checkBox.checked = true;
    } else {
        checkBox.checked = false;
    }
}