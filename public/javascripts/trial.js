// Global variables for storing the images and their infos
var imageInfos = [];
var images = [];

// Global variables for tracking the mouse position and selected image
var startX, startY;
var selectedImgIndex = -1;

// Image settings
const IMAGE_SIZE = 30;
const PADDING = 5;

// Canvas settings
const WIDTH = 1000;
const HEIGHT = 600;
const SCALE = 2;

// Experiment settings
const N_IMAGES_PER_TRAIL = 16;
const N_ROWS = 4;
const N_COLS = 4;

const N_TOTAL_IMAGES = 30;
const N_TRAILS = 6;

// Validation threshold
// Only allow proceeding to the next task
// when at least this percentage of images are moved
const VALIDATION_THRESHOLD = 0.5;

// Trails
const trials = [
  [3, 4, 7, 8, 9, 10, 11, 13, 14, 15, 17, 18, 21, 22, 26, 30],
  [5, 6, 10, 11, 12, 16, 18, 19, 20, 22, 23, 25, 27, 28, 29, 30],
  [1, 2, 3, 4, 6, 7, 11, 13, 14, 15, 16, 19, 23, 24, 26, 28],
  [1, 2, 5, 7, 8, 9, 12, 15, 17, 19, 21, 23, 24, 25, 27, 28],
  [2, 3, 4, 5, 6, 7, 12, 13, 14, 20, 21, 25, 26, 27, 29, 30],
  [1, 2, 6, 8, 9, 10, 15, 16, 17, 18, 20, 21, 22, 24, 29, 30],
];

// Random image ids from the current trail
var random_image_ids = [];

// Webpage onload entry point
function start(objectIdArray) {
  const canvas = document.getElementById("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = HEIGHT * SCALE;

  // Set the scale so that images on canvas
  // can be drawn in higher resolution
  const ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);

  random_image_ids = generateImageIds(objectIdArray);
  reset();
  add_listener();
}

function generateImageIds(objectIdArray) {
  // The `id` variable is injected from the jade template
  var trail = trials[id - 1];
  trail.sort(() => Math.random() - 0.5);

  // Parse JSON to get the object ids and build the objectIdMap
  var objectIdMap = new Map();
  for (var i = 0; i < objectIdArray.length; i++) {
    objectIdMap[i + 1] = objectIdArray[i];
  }

  // Map the ids in a trail to the object ids
  var imageIds = [];
  for (var i = 0; i < trail.length; i++) {
    imageIds.push(objectIdMap[trail[i]]);
  }

  return imageIds;
}

function getInitialImagePosition(index) {
  row = Math.floor(index / N_COLS);
  col = index % N_COLS;

  // Get the total width and height of required to draw all images
  const padding = 50;
  const totalWidth =
    N_COLS * (SCALE * IMAGE_SIZE + 2 * PADDING) + (N_COLS - 1) * padding;
  const totalHeight =
    N_ROWS * (SCALE * IMAGE_SIZE + 2 * PADDING) + (N_ROWS - 1) * padding;

  // Center the whole image grid
  const originX = (WIDTH - totalWidth) / 2;
  const originY = (HEIGHT - totalHeight) / 2;

  // Calculate the position of the image
  const x = originX + col * (SCALE * IMAGE_SIZE + 2 * PADDING) + col * padding;
  const y = originY + row * (SCALE * IMAGE_SIZE + 2 * PADDING) + row * padding;

  return [x, y];
}

function init_images() {
  // Load images and setup imageInfos for tracking the position of images
  imageInfos = [];
  for (let i = 1; i <= N_IMAGES_PER_TRAIL; i++) {
    // Load image
    const img = new Image();
    const idx = random_image_ids[i - 1];
    img.src = "images/objects/" + idx + ".PNG";
    img.onload = draw; // Call `draw` when the image is loaded
    images.push(img);

    // Stores the infomration of the bounding box
    // and position of the image
    [initialX, initialY] = getInitialImagePosition(i - 1);
    imageInfos.push({
      text: "obj" + idx,
      object_id: idx,

      // Bounding box
      x: initialX,
      y: initialY,
      width: SCALE * IMAGE_SIZE + 2 * PADDING,
      height: SCALE * IMAGE_SIZE + 2 * PADDING,

      // Image
      image_width: SCALE * IMAGE_SIZE,
      image_height: SCALE * IMAGE_SIZE,
    });
  }
}

function add_listener() {
  const canvas = document.getElementById("canvas");

  canvas.addEventListener("mousedown", handleMouseDown, false);
  canvas.addEventListener("mousemove", handleMouseMove, false);
  canvas.addEventListener("mouseup", resetIndex, false);
  canvas.addEventListener("mouseout", resetIndex, false);
}

function reset() {
  init_images();
  draw();
}

function draw() {
  // Clear canvas
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all images
  for (let i = 0; i < imageInfos.length; i++) {
    const imageInfo = imageInfos[i];

    // Draw the bounding box
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 1;
    ctx.strokeRect(imageInfo.x, imageInfo.y, imageInfo.width, imageInfo.height);

    const img = images[i];
    ctx.drawImage(
      img,
      imageInfo.x + PADDING,
      imageInfo.y + PADDING,
      imageInfo.image_height,
      imageInfo.image_width
    );
    ctx.imageSmoothingEnabled = true;
  }
}

function getMousePosWithinCanvas(e) {
  const canvas = document.getElementById("canvas");
  let rect = canvas.getBoundingClientRect();
  offsetX = rect.left;
  offsetY = rect.top;

  const mouseX = parseInt(e.clientX - offsetX);
  const mouseY = parseInt(e.clientY - offsetY);
  return [mouseX, mouseY];
}

// Test if the (x, y) is within the bounding of the image at index
function hitTest(x, y, index) {
  const imageInfo = imageInfos[index];
  return (
    x >= imageInfo.x &&
    x <= imageInfo.x + imageInfo.width &&
    y >= imageInfo.y &&
    y <= imageInfo.y + imageInfo.height
  );
}

// Check if the mouse down event lands within the bounding box of a image
// If so, set the selectedImgIndex to the index of the image
function handleMouseDown(e) {
  e.preventDefault();

  [startX, startY] = getMousePosWithinCanvas(e);
  for (var i = 0; i < imageInfos.length; i++) {
    if (hitTest(startX, startY, i)) {
      selectedImgIndex = i;
    }
  }
}

function resetIndex(e) {
  e.preventDefault();
  selectedImgIndex = -1;
}

// As we move the mouse, this function will be called multiple times.
// The actual call frequency is determined by the browser and the users hardware.
function handleMouseMove(e) {
  e.preventDefault();

  // If no image is being selected, do nothing
  if (selectedImgIndex < 0) {
    return;
  }

  const [mouseX, mouseY] = getMousePosWithinCanvas(e);

  const dx = mouseX - startX;
  const dy = mouseY - startY;

  // Update the position of the image
  const imageInfo = imageInfos[selectedImgIndex];
  imageInfo.x += dx;
  imageInfo.y += dy;

  draw();

  // Set the new start position to the current mouse position
  startX = mouseX;
  startY = mouseY;
}

function next() {
  // Validate the current trial
  // Only when at leaset VALIDATION_THRESHOLD of images are moved
  // can the user proceed to the next trial
  var nMoved = 0;
  for (let i = 0; i < imageInfos.length; i++) {
    if (imageHasBeenMoved(i)) {
      nMoved++;
    }
  }
  if (nMoved < VALIDATION_THRESHOLD * imageInfos.length) {
    alert(
      "Please complete the current task before proceeding to the next one."
    );
    return;
  }

  // Build a form to send data to the logging endpoint
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/log/trial/" + id;

  // Build the data
  var data = [];
  for (const img of imageInfos) {
    let x = img.x + IMAGE_SIZE + PADDING;
    let y = img.y + IMAGE_SIZE + PADDING;
    data.push(
      JSON.stringify({ trial_id: id, object_id: img.object_id, x: x, y: y })
    );
  }

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "data";
  input.value = JSON.stringify(data);
  form.appendChild(input);

  // Submit the form
  document.body.appendChild(form);
  form.submit();
}

function imageHasBeenMoved(idx) {
  const imageInfo = imageInfos[idx];
  const initialX = getInitialImagePosition(idx)[0];
  const initialY = getInitialImagePosition(idx)[1];
  return imageInfo.x != initialX || imageInfo.y != initialY;
}
