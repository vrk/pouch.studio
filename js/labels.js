const CANVAS_WIDTH_INCHES = 8.5;
const CANVAS_HEIGHT_INCHES = 11;
const CSS_PIXELS_PER_INCH = 96;
const DPI = 300;
const PIXELS_PER_INCH = DPI;

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
setDPI(canvas, DPI);
const ctx = canvas.getContext('2d');

const image = new Image();
image.addEventListener("load", async (e) => {
  const font = new FontFace("IBMPlexMono", "url(/fonts/IBMPlexMono-regular.ttf)", {
    style: "normal",
    weight: "400"
  });
  // wait for font to be loaded
  await font.load();
  // add font to document
  document.fonts.add(font);

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const gumroadAddresses = await processGumroadFile("/tools/gumroad-customers.csv");
  console.log(gumroadAddresses);
  drawAddresses(canvas, ctx, gumroadAddresses)
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
            street: address,
            lastLine: `${city}, ${state} ${zip}`
          })
      }
  }
  return americanAddresses;
}

const Y_START_MARGIN = inchToPixels(1.5);
const X_START_MARGIN = inchToPixels(0.75);
const X_LIMIT = inchToPixels(7.75);
const Y_LIMIT = inchToPixels(9.5);
const X_SPACING = inchToPixels(0.25);
const Y_SPACING = inchToPixels(0.5);
const LINE_SPACING = inchToPixels(0.1);
function drawAddresses(canvas, ctx, addresses) {
  ctx.fillStyle = 'black';
  ctx.font = "60px IBMPlexMono";
  let yCursor = Y_START_MARGIN;
  let xCursor = X_START_MARGIN;
  for (const address of addresses) {
    const { name, street, lastLine } = address;

    const nameSize = ctx.measureText(name);
    const streetSize = ctx.measureText(street);
    const lastLineSize = ctx.measureText(lastLine);

    const nameHeight = getHeightFromTextMetrics(nameSize);
    const streetHeight = getHeightFromTextMetrics(streetSize);
    const lastLineHeight = getHeightFromTextMetrics(lastLineSize);

    const longestLineWidth = Math.max(nameSize.width, streetSize.width, lastLineSize.width);
    const addressHeight = nameHeight + streetHeight + lastLineHeight + LINE_SPACING * 2;

    if ((xCursor + longestLineWidth) > X_LIMIT) {
      xCursor = X_START_MARGIN;
      yCursor += addressHeight + Y_SPACING;
      if ((yCursor + addressHeight) > Y_LIMIT) {
        console.log(yCursor, addressHeight, Y_LIMIT)
        break;
      }
    }

    let innerYCursor = yCursor;
    ctx.fillText(name, xCursor, innerYCursor);
    innerYCursor += nameHeight + LINE_SPACING;

    ctx.fillText(street, xCursor, innerYCursor);
    innerYCursor += streetHeight+ LINE_SPACING;
    
    ctx.fillText(lastLine, xCursor, innerYCursor);
    innerYCursor += lastLineHeight;

    xCursor += longestLineWidth + X_SPACING;
  }
}

function inchToPixels(inch) {
  return inch * PIXELS_PER_INCH;
}

function getHeightFromTextMetrics(textMetrics) {
  return textMetrics.actualBoundingBoxDescent + textMetrics.actualBoundingBoxAscent;
}