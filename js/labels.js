const CANVAS_WIDTH_INCHES = 8.5;
const CANVAS_HEIGHT_INCHES = 11;
const CSS_PIXELS_PER_INCH = 96;

function setDPI(canvas, dpi) {
  // Set up CSS size.
  canvas.style.width = `${CANVAS_WIDTH_INCHES}in`;
  canvas.style.height = `${CANVAS_HEIGHT_INCHES}in`;

  // Get size information.
  const scaleFactor = dpi / CSS_PIXELS_PER_INCH;
  const width = CANVAS_WIDTH_INCHES * CSS_PIXELS_PER_INCH;
  const height = CANVAS_HEIGHT_INCHES * CSS_PIXELS_PER_INCH;

  // Resize the canvas.
  canvas.width = Math.ceil(width * scaleFactor);
  canvas.height = Math.ceil(height * scaleFactor);
}

const canvas = document.getElementById('page');
setDPI(canvas, 300);
const context = canvas.getContext('2d');
// context.fillStyle = 'red';
// context.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.addEventListener("load", (e) => {
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  console.log('drawn');
});
image.src = "/images/silhouette-bg.png";


