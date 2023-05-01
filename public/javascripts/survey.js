document.addEventListener("DOMContentLoaded", function () {
  // Initialize the select element
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, {});
});

// Track the selctor values
const genderSelector = document.getElementById("gender_selector");
genderSelector.addEventListener("change", function () {
  const instance = M.FormSelect.getInstance(genderSelector);
  const selectedValues = instance.getSelectedValues();
  const gender = document.getElementById("gender");
  gender.value = selectedValues[0];
});

const raceSelector = document.getElementById("race_selector");
raceSelector.addEventListener("change", function () {
  const instance = M.FormSelect.getInstance(raceSelector);
  const selectedValues = instance.getSelectedValues();
  const race = document.getElementById("race");
  race.value = selectedValues[0];
});
