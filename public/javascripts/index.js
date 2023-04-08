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

// Experimetn settings
const N_IMAGES_PER_TRAIL = 16;
const N_TOTAL_IMAGES = 30;
const N_TRAILS = 5;

// Webpage onload entry point
function start() {
  const canvas = document.getElementById("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = HEIGHT * SCALE;

  // Set the scale so that images on canvas
  // can be drawn in higher resolution
  const ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);

  reset();
  add_listener();
}

function getInitialImagePosition(index, totalRows, totalCols) {
  row = Math.floor(index / totalCols);
  col = index % totalCols;

  // Get the total width and height of required
  // for placing totalRows * totalCols images with a padding of 10px
  const padding = 50;
  const totalWidth =
    totalCols * (SCALE * IMAGE_SIZE + 2 * PADDING) + (totalCols - 1) * padding;
  const totalHeight =
    totalRows * (SCALE * IMAGE_SIZE + 2 * PADDING) + (totalRows - 1) * padding;

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
  let current_y = 100;
  for (let i = 1; i <= N_IMAGES_PER_TRAIL; i++) {
    // Load image
    const img = new Image();
    img.src = "images/objects/" + i + ".PNG";
    img.onload = draw; // Call `draw` when the image is loaded
    images.push(img);

    // Stores the infomration of the bounding box
    // and position of the image
    [initialX, initialY] = getInitialImagePosition(i - 1, 4, 4);
    imageInfos.push({
      text: "obj" + i,

      // Bounding box
      x: initialX,
      y: initialY,
      width: SCALE * IMAGE_SIZE + 2 * PADDING,
      height: SCALE * IMAGE_SIZE + 2 * PADDING,

      // Image
      // TODO(edwardd): Keep the original image ratio
      image_width: SCALE * IMAGE_SIZE,
      image_height: SCALE * IMAGE_SIZE,
    });

    current_y += SCALE * IMAGE_SIZE + 2 * PADDING + 10;
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

function submit() {
  console.log("------ Logged Position ------");
  for (var i = 0; i < imageInfos.length; i++) {
    var text = imageInfos[i];
    let x = text.x + IMAGE_SIZE + PADDING;
    let y = text.y + IMAGE_SIZE + PADDING;
    let imgId = text.text;
    console.log("%s position: (%f, %f)", imgId, x, y);
  }

  var data = [];
  for (var i = 0; i < imageInfos.length; i++) {
    var text = imageInfos[i];
    let x = text.x + IMAGE_SIZE + PADDING;
    let y = text.y + IMAGE_SIZE + PADDING;
    let imgId = text.text;
    data.push({ page: "1", img_id: imgId, x: x, y: y });
  }

  fetch("/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: data }),
  });
}
