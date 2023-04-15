function validateInput(e) {
  // Check at lease one option is selected
  const radioButtons = document.getElementsByName("seen");
  var isSelected = false;
  for (let radio of radioButtons) {
    if (radio.checked) {
      isSelected = true;
    }
  }

  const description = document.getElementById("description").value;

  if (!isSelected || description == "") {
    alert(
      "Please complete the current task before proceeding to the next one."
    );
    e.preventDefault();
  }
}
