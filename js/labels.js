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
image.addEventListener("load", async (e) => {
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const gumroadAddresses = await processGumroadFile("/tools/gumroad-customers.csv");
  console.log(gumroadAddresses);
});
image.src = "/images/silhouette-bg.png";

async function processGumroadFile(url) {
  const response = await fetch(url);
  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Convert it to text
  const data = await response.text();

  // Split the text into lines
  const lines = data.split('\n');

  const americanAddresses = [];

  // Loop through each line (skip the first if it contains headers)
  for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {  // Check if the line is not just whitespace
          const columns = lines[i].split(',');
          // const country = columns[columns.length - 1];
          const state = columns[columns.length - 2];
          const zip = columns[columns.length - 3];
          const city = columns[columns.length - 4];
          const name = columns[0];

          // Ugly way to build up the address with unknown # of commas
          const addressTokens = columns.length - 5; // there are 5 known tokens, the rest are address tokens
          let address = "";
          for (let i = 0; i < addressTokens; i++) {
            address += columns[1 + i];
          }

          americanAddresses.push({
            name,
            address,
            lastLine: `${city}, ${state} ${zip}`
          })
      }
  }
  return americanAddresses;
}
