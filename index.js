let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let mouseX = 0, mouseY = 0, lastX = 0, lastY = 0, startX = 0, startY = 0;
let zoomFactor = 100;
let drag = false;

// for screen DPI
let dpi = window.devicePixelRatio;

window.onresize = function() {
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  canvas.width = window.innerWidth * dpi;
  canvas.height = window.innerHeight * dpi;
  requestAnimationFrame(animate);
};

window.onresize();

canvas.addEventListener('mousedown', (e) => {
  startX = mouseX;
  startY = mouseY;
  
  lastX = e.clientX;
  lastY = e.clientY;
  
  drag = true;
  return false;
});

canvas.addEventListener('mouseup', () => {
    drag = false;
});
document.addEventListener('mouseup', () => {
    drag = false;
});

canvas.addEventListener('mousemove', (e) => {
  if(drag){
    mouseX = startX - (e.clientX - lastX) * dpi / zoomFactor;
    mouseY = startY - (e.clientY - lastY) * dpi / zoomFactor;

  requestAnimationFrame(animate);
  }
});

canvas.addEventListener('wheel', (e) => {
  
  e.preventDefault();
  const factor = e.deltaY > 0 ? 0.9 : 1/0.9;
  
  mouseX += e.clientX * dpi / zoomFactor;
  mouseY += e.clientY * dpi / zoomFactor;
    
  zoomFactor = factor * zoomFactor;
  
  mouseX -= e.clientX * dpi / zoomFactor;
  mouseY -= e.clientY * dpi / zoomFactor;
    
  requestAnimationFrame(animate);
  console.log( e.clientX );
}, {passive: false});

function drawCircle( x, y, r ) {
  let cx = (x-mouseX) * zoomFactor;
  let cy = (y-mouseY) * zoomFactor;
  let cr = zoomFactor * r;

  let minx = cx - cr;
  let maxx = cx + cr;
  let miny = cy - cr;
  let maxy = cy + cr;

  if (maxx < 0)
    return false;
  if (minx > canvas.width)
    return false;
  if (maxy < 0)
    return false;
  if (miny > canvas.height)
    return false;
  
  context.beginPath();
  context.arc(cx, cy, cr, 0, 2*Math.PI);
  context.stroke();
  return true;
}

function drawFordCircle( p, q ) {
  if (zoomFactor * (1 / (2*q*q)) < 1)
    return;

  let x = p / q;
  let y = - (1 / (2*q*q));
  let r = 1 / (2*q*q)

  if (!drawCircle( x, y, r ))
    return;

  let height = Math.floor(zoomFactor / q / q / 2);
  let text = p + "/" + q;
  let xwidth = 0.6;
  if (text.length * height * xwidth > r * zoomFactor)
    height = Math.floor(r * zoomFactor / text.length / xwidth);
  if (height > 2) {
    context.font = height + "px sans";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText(text, (x - mouseX) * zoomFactor, (y - mouseY) * zoomFactor + height / 2);
  }
}

function drawVerticalLine( x ) {
  let cx = (x-mouseX) * zoomFactor;

  context.strokeStyle = "black";
  
  context.beginPath();
  context.moveTo(cx, 0);
  context.lineTo(cx, -mouseY * zoomFactor);
  context.lineTo(cx, -mouseY * zoomFactor);
  context.stroke();
}

function farey(n) {
    let a = 0;
    let b = 1;
    let c = 1;
    let d = n;
    while (c <= n) {
        let k = Math.floor((n + b) / d);
        let a_ = a;
        let b_ = b;
        a = c;
        b = d;
        c = k * c - a_;
      d = k * d - b_;
      drawFordCircle( a, b );
    }
}


function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  let minX = mouseX ;
  let minY = mouseY ;
  let maxX = canvas.width / zoomFactor + mouseX;
  let maxY = canvas.height / zoomFactor + mouseY;

  console.log( minX, maxX );
  context.fillStyle = "gray";
  context.fillRect(0, -mouseY * zoomFactor, canvas.width, canvas.height);
  
  context.fillStyle = "white";

  drawFordCircle( 0, 1 );
  farey( 2500 );
  
  drawVerticalLine( 89.0 / 233.0 );
  drawVerticalLine( 1 / Math.sqrt(2) );
  
}

document.addEventListener("DOMContentLoaded", () => {
  animate();
});

