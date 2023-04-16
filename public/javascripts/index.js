function validateInput(e) {
  const uidInput = document.getElementById("uid_input");
  if (uidInput.value.length != 9) {
    alert("Please enter a valid UID.");
    e.preventDefault();
  }
}
