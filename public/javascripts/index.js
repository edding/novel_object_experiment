// TODO: Better to validate on submit and prompt error instead of validate on input
function validateInput() {
  const input = document.getElementById("uid_input");
  const submitButton = document.getElementById("uid_submit");
  if (input.value.length != 9) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
}
