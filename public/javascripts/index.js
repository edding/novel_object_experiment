var ctx, isDown, offsetX, offsetY, startX, startY;
var storedLines = [];
var mode = "drag";
var imageInfos = [];
var images = [];

var drawFromText = -1;
var selectedText = -1;

// Image settings
const IMAGE_SIZE = 30;
const PADDING = 5;

// Canvas setting
const WIDTH = 1000;
const HEIGHT = 600;
const SCALE = 2;

const N_IMAGES = 30;

function init_images() {
  // Load images and setup imageInfos for tracking the position of images
  imageInfos = [];
  let current_y = 100;
  for (let i = 1; i <= 5; i++) {
    // Load image
    const img = new Image();
    img.src = "images/objects/" + i + ".PNG";
    img.onload = draw; // Call `draw` when the image is loaded
    images.push(img);

    // Stores the infomration of the bounding box
    // and position of the image
    imageInfos.push({
      text: "obj" + i,

      // Bounding box
      x: WIDTH / 2 - IMAGE_SIZE - PADDING,
      y: current_y,
      width: SCALE * IMAGE_SIZE + 2 * PADDING,
      height: SCALE * IMAGE_SIZE + 2 * PADDING,

      // Image
      image_width: SCALE * IMAGE_SIZE,
      image_height: SCALE * IMAGE_SIZE,
    });

    current_y += SCALE * IMAGE_SIZE + 2 * PADDING + 10;
  }
}

function start() {
  const canvas = document.getElementById("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = HEIGHT * SCALE;

  ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);

  // variables used to get mouse position on the canvas
  reset_offset();

  // START: draw all texts to the canvas
  reset();
  add_listener();
}

function set_mode(m) {
  mode = m;
}

function add_listener() {
  const canvas = document.getElementById("canvas");

  canvas.addEventListener("mousedown", handleMouseDown, false);
  canvas.addEventListener("mousemove", handleMouseMove, false);
  canvas.addEventListener("mouseup", handleMouseUp, false);
  canvas.addEventListener("mouseout", handleMouseOut, false);

  // Add active class to the current button (highlight it)
  var btns = document.getElementsByClassName("btn");
  for (var i = 0; i < btns.length - 2; i++) {
    btns[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("active");
      if (current.length > 0) {
        current[0].className = current[0].className.replace(" active", "");
      }
      this.className += " active";
    });
  }
}

function reset_offset() {
  const canvas = document.getElementById("canvas");
  let rect = canvas.getBoundingClientRect();
  offsetX = rect.left;
  offsetY = rect.top;
}

function reset() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  storedLines = [];
  init_images();
  draw();
  set_mode("drag");

  // change active button
  var current = document.getElementsByClassName("active");
  if (current.length > 0) {
    current[0].className = current[0].className.replace(" active", "");
  }
  var dragBtn = document.getElementById("dragText");
  dragBtn.className += " active";
}

function draw() {
  const canvas = document.getElementById("canvas");

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all images
  for (let i = 0; i < imageInfos.length; i++) {
    const imageInfo = imageInfos[i];

    // Draw the bounding box
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 1;
    ctx.strokeRect(imageInfo.x, imageInfo.y, imageInfo.width, imageInfo.height);
    // ctx.fillStyle = "white";
    // ctx.fillRect(...rect_bound);

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

// test if x,y is inside the bounding box of texts[textIndex]
function textHittest(x, y, textIndex) {
  var text = imageInfos[textIndex];
  return (
    x >= text.x - PADDING &&
    x <= text.x + IMAGE_SIZE * 2 + PADDING &&
    y >= text.y - PADDING &&
    y <= text.y + IMAGE_SIZE * 2 + PADDING
  );
}

function redo() {
  switch (mode) {
    case "drag":
      break;
    case "draw":
      storedLines.pop();
      draw();
      break;
    default:
    // code block
  }
}

// handle mousedown events
// iterate through texts[] and see if the user
// mousedown'ed on one of them
// If yes, set the selectedText to the index of that text
function handleMouseDown(e) {
  reset_offset();
  e.preventDefault();
  switch (mode) {
    case "drag":
      startX = parseInt(e.clientX - offsetX);
      startY = parseInt(e.clientY - offsetY);

      for (var i = 0; i < imageInfos.length; i++) {
        if (textHittest(startX, startY, i)) {
          selectedText = i;
        }
      }

      break;
    case "draw":
      var mouseX = parseInt(e.clientX - offsetX);
      var mouseY = parseInt(e.clientY - offsetY);
      drawFromText = -1;
      for (var i = 0; i < imageInfos.length; i++) {
        if (textHittest(mouseX, mouseY, i)) {
          drawFromText = i;
        }
      }

      if (drawFromText < 0) {
        break;
      }

      e.stopPropagation();

      isDown = true;
      startX = mouseX;
      startY = mouseY;
      break;
    default:
    // code block
  }
}

// done dragging
function handleMouseUp(e) {
  e.preventDefault();
  switch (mode) {
    case "drag":
      selectedText = -1;
      break;
    case "draw":
      var mouseX = parseInt(e.clientX - offsetX);
      var mouseY = parseInt(e.clientY - offsetY);
      var drawToText = -1;
      for (var i = 0; i < imageInfos.length; i++) {
        if (textHittest(mouseX, mouseY, i)) {
          drawToText = i;
        }
      }

      e.stopPropagation();

      isDown = false;

      if (drawToText >= 0 && drawFromText >= 0 && drawToText !== drawFromText) {
        storedLines.push({
          x1: startX,
          y1: startY,
          x2: mouseX,
          y2: mouseY,
        });
      }

      draw();
      break;
    default:
    // code block
  }
}

// also done dragging
function handleMouseOut(e) {
  e.preventDefault();
  switch (mode) {
    case "drag":
      selectedText = -1;
      break;
    case "draw":
      e.stopPropagation();

      if (!isDown) {
        return;
      }

      isDown = false;

      draw();
      break;
    default:
    // code block
  }
}

// handle mousemove events
// calc how far the mouse has been dragged since
// the last mousemove event and move the selected text
// by that distance
function handleMouseMove(e) {
  e.preventDefault();
  switch (mode) {
    case "drag":
      if (selectedText < 0) {
        return;
      }
      mouseX = parseInt(e.clientX - offsetX);
      mouseY = parseInt(e.clientY - offsetY);

      // Put your mousemove stuff here
      var dx = mouseX - startX;
      var dy = mouseY - startY;
      startX = mouseX;
      startY = mouseY;

      var text = imageInfos[selectedText];
      text.x += dx;
      text.y += dy;
      draw();
      break;
    case "draw":
      e.stopPropagation();

      if (!isDown) {
        return;
      }

      draw();

      var mouseX = parseInt(e.clientX - offsetX);
      var mouseY = parseInt(e.clientY - offsetY);

      // draw the current line
      ctx.beginPath();
      // ctx.moveTo(startX, startY);
      // ctx.lineTo(mouseX, mouseY);
      canvas_arrow(ctx, startX, startY, mouseX, mouseY);
      ctx.stroke();
      break;
    default:
    // code block
  }
}

function canvas_arrow(context, fromx, fromy, tox, toy) {
  ctx.strokeStyle = "orange";
  ctx.lineWidth = 3;
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  );
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
