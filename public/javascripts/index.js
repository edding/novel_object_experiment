function validateInput(e) {
  const uidInput = document.getElementById("uid_input");
  if (uidInput.value.length != 9) {
    alert("Please enter a valid UID.");
    e.preventDefault();
  } else {
    const nameInput = document.getElementById("name_input");
    if (nameInput.value.length == 0) {
      alert("Please enter your name.");
      e.preventDefault();
    }
  }
}
