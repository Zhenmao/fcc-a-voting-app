// Add another option when click "Add an option" button
document.getElementById("add-option").addEventListener("click", function() {
    const input = document.createElement("input");
    input.setAttribute("class", "pollOptions form-control");
    input.setAttribute("name", "pollOptions[]");
    input.setAttribute("placeholder", "Poll option");
    document.getElementById("poll-options").append(input); 
});