var canvas, ctx, isDown, offsetX, offsetY, startX, startY;
var storedLines = [];
var mode = 'drag';
var texts = [];
var text_up_down_pad = 5;
var text_left_right_pad = 5;
var drawFromText = -1;
var selectedText = -1;
const IMAGE_SIZE = 30;

const WIDTH = 1000;
const HEIGHT = 600;
const SCALE = 2;

function init_text() {
    text_list = ["obj1", "obj2", "obj3", "obj4", "obj5"];   // change the diagram by changing the text_list here, or you can pass in a text_list to the function

    texts = [];
    for (let i = 0; i < text_list.length; i++) {
        texts.push({
            text: text_list[i],
        });
    }

    let cur_y = 100;
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        text.width = SCALE * IMAGE_SIZE
        text.height = SCALE * IMAGE_SIZE;

        text.x = WIDTH / 2 - IMAGE_SIZE;
        text.y = cur_y;
        cur_y += SCALE * IMAGE_SIZE + 2 * text_up_down_pad + 10;
    }
}


function start() {
    canvas = document.getElementById("canvas");
    canvas.width = WIDTH * SCALE;
    canvas.height = HEIGHT * SCALE;

    ctx = canvas.getContext("2d");
    ctx.scale(SCALE, SCALE)

    // variables used to get mouse position on the canvas
    reset_offset();

    // START: draw all texts to the canvas
    reset();
    add_listener();

    // $('#next').mouseup(function(event) {
    //     $('#next').unbind('mouseup');
    //     // next step here
    // });
}

function set_mode(m) {
    mode = m;
}

function add_listener() {
    canvas = document.getElementById("canvas");

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
    let rect = canvas.getBoundingClientRect();
    offsetX = rect.left;
    offsetY = rect.top;
}


function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    storedLines = [];
    init_text();
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


function move_attached_lines() {
    var cleanedStoredLines = []
    for (var i = 0; i < storedLines.length; i++) {
        var hit1 = -1;
        var hit2 = -1;
        for (var j = 0; j < texts.length; j++) {
            if (textHittest(storedLines[i].x1, storedLines[i].y1, j)) {
                hit1 = j;
            }
            if (textHittest(storedLines[i].x2, storedLines[i].y2, j)) {
                hit2 = j;
            }
        }
        if (hit1 >= 0 && hit2 >= 0 && hit1 !== hit2) {
            cleanedStoredLines.push(storedLines[i])
        }
    }
    storedLines = cleanedStoredLines;
}


// clear the canvas draw all texts
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];

        // draw rectangle around text
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 1;

        rect_bound = [
            (text.x - text_left_right_pad),
            (text.y - text_up_down_pad),
            (IMAGE_SIZE * SCALE + 2 * text_left_right_pad),
            (2 * text_up_down_pad + IMAGE_SIZE * SCALE)
        ]
        ctx.strokeRect(...rect_bound);

        // Fill the rectangle
        // Note: need to figure out the z index before uncommenting this
        // ctx.fillStyle = "white";
        // ctx.fillRect(...rect_bound);

        // ctx.fillText(text.text, text.x, text.y);
        let imgId = text.text;
        let img = document.getElementById(imgId);
        ctx.drawImage(img, text.x, text.y, SCALE * IMAGE_SIZE, SCALE * IMAGE_SIZE);
        ctx.imageSmoothingEnabled = true;
    }

    move_attached_lines();
    if (storedLines.length == 0) {
        return;
    }

    // redraw each stored line
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 3;
    for (var i = 0; i < storedLines.length; i++) {
        ctx.beginPath();
        // ctx.moveTo(storedLines[i].x1, storedLines[i].y1);
        // ctx.lineTo(storedLines[i].x2, storedLines[i].y2);
        canvas_arrow(ctx, storedLines[i].x1, storedLines[i].y1, storedLines[i].x2, storedLines[i].y2);
        ctx.stroke();
    }
}

// test if x,y is inside the bounding box of texts[textIndex]
function textHittest(x, y, textIndex) {
    var text = texts[textIndex];
    return (x >= text.x - text_left_right_pad && x <= text.x + IMAGE_SIZE * 2 + text_left_right_pad
        && y >= text.y - text_up_down_pad && y <= text.y + IMAGE_SIZE * 2 + text_up_down_pad);
}


function redo() {
    switch (mode) {
        case 'drag':
            break;
        case 'draw':
            storedLines.pop()
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
        case 'drag':
            startX = parseInt(e.clientX - offsetX);
            startY = parseInt(e.clientY - offsetY);

            for (var i = 0; i < texts.length; i++) {
                if (textHittest(startX, startY, i)) {
                    selectedText = i;
                }
            }

            break;
        case 'draw':
            var mouseX = parseInt(e.clientX - offsetX);
            var mouseY = parseInt(e.clientY - offsetY);
            drawFromText = -1;
            for (var i = 0; i < texts.length; i++) {
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
        case 'drag':
            selectedText = -1;
            break;
        case 'draw':
            var mouseX = parseInt(e.clientX - offsetX);
            var mouseY = parseInt(e.clientY - offsetY);
            var drawToText = -1;
            for (var i = 0; i < texts.length; i++) {
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
                    y2: mouseY
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
        case 'drag':
            selectedText = -1;
            break;
        case 'draw':
            e.stopPropagation();

            if (!isDown) { return; }

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
        case 'drag':
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

            var text = texts[selectedText];
            text.x += dx;
            text.y += dy;
            draw();
            break;
        case 'draw':
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
            ctx.stroke()
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
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}


function submit() {
    console.log("------ Logged Position ------")
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        let x = text.x + IMAGE_SIZE + text_left_right_pad;
        let y = text.y + IMAGE_SIZE + text_up_down_pad;
        let imgId = text.text;
        console.log("%s position: (%f, %f)", imgId, x, y);
    }

    var data = [];
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        let x = text.x + IMAGE_SIZE + text_left_right_pad;
        let y = text.y + IMAGE_SIZE + text_up_down_pad;
        let imgId = text.text;
        data.push({ page: "1", img_id: imgId, x: x, y: y });
    }

    fetch('/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "data": data })
    });
}