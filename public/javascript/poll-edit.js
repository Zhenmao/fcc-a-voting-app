[].forEach.call(document.getElementsByClassName("option-button"), function(button) {
    button.addEventListener("click", function() {
        // Disable all submit buttons
        [].forEach.call(document.getElementsByClassName("option-button"), function(btn) {
            btn.classList.add("not-selected");
        });
        this.classList.remove("not-selected");
        this.classList.add("selected");
    });
});