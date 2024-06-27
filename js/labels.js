const CANVAS_WIDTH_INCHES = 8.5;
const CANVAS_HEIGHT_INCHES = 11;
const CSS_PIXELS_PER_INCH = 96;
const DPI = 300;
const PIXELS_PER_INCH = DPI;

const FONT_STYLE = "50px IBMPlexMono";

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

const extraCanvasContainer = document.getElementById('additional');
const canvas = document.getElementById('page');
setDPI(canvas, DPI);
const ctx = canvas.getContext('2d', { colorSpace: "srgb" });

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
  // const gumroadAddresses = await processGumroadFile("/tools/gumroad-customers.csv");
  // drawAddresses(ctx, gumroadAddresses);

  const newCanvas = document.createElement('canvas');
  extraCanvasContainer.append(newCanvas);
  setDPI(newCanvas, DPI);
  const newCtx = newCanvas.getContext('2d');
  const payhipAddresses = await processPayhipFile("/tools/june20.tsv");
  drawAddresses(newCtx, payhipAddresses);
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

  for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim()) {  // Check if the line is not just whitespace
          let columns = lines[i].split(',');
          // const country = columns[columns.length - 1];
          const state = columns[columns.length - 2];
          const zip = columns[columns.length - 3];
          const city = columns[columns.length - 4];
          const name = columns[0];

          // Ugly way to build up the address with unknown # of commas
          const numAddressTokens = columns.length - 5; // there are 5 known tokens, the rest are address tokens
          const addressTokenList = [];
          for (let i = 0; i < numAddressTokens; i++) {
            addressTokenList.push(columns[1 + i]); // 1 + i because we're skipping the name field at index 0
          }
          const address = addressTokenList.join(" ");

          americanAddresses.push({
            name,
            street: address.trim(),
            lastLine: `${city}, ${state} ${zip}`
          })
      }
  }
  return americanAddresses;
}

async function processPayhipFile(url) {
  const response = await fetch(url);
  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Convert it to text
  const data = await response.text();

  // Split the text into lines
  const lines = data.split('\n');

  const americanAddresses = [];

  for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim()) {  // Check if the line is not just whitespace
          let columns = lines[i].split('\t');
          columns = columns.map(v => v.trim());
          console.log(columns);
          // First Name	Last Name	Address Line 1	Address Line 2	City	State Name	ZIP / Postcode	Country Name
          // const country = columns[columns.length - 1];
          const firstName = columns[0];
          const lastName = columns[1];
          const addressLine1 = columns[2];
          const addressLine2 = columns[3];
          const city = columns[4];
          const state = columns[5];
          const zip = columns[6];
          const country = columns[7];
          
          const name = `${firstName} ${lastName}`;
          const address = `${addressLine1} ${addressLine2}`;

          americanAddresses.push({
            name,
            street: address,
            lastLine: `${city}, ${state} ${zip}`
          })
      }
  }
  return americanAddresses;
}

const PADDING = inchToPixels(0.2);
const Y_START_MARGIN = inchToPixels(1.5) + PADDING;
const X_START_MARGIN = inchToPixels(0.75) + PADDING;
const X_LIMIT = inchToPixels(7.75);
const Y_LIMIT = inchToPixels(9.5);
const X_SPACING = inchToPixels(0.1);
const Y_SPACING = inchToPixels(0.1);
const LINE_SPACING = inchToPixels(0.05);
let tallestAddressForRow = -1;

function drawAddresses(startingCtx, addresses) {
  let ctx = startingCtx;
  ctx.fillStyle = 'black';
  ctx.font = FONT_STYLE;
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
    tallestAddressForRow = Math.max(tallestAddressForRow, addressHeight);

    if ((xCursor + longestLineWidth + PADDING * 2) > X_LIMIT) {
      xCursor = X_START_MARGIN;
      yCursor += tallestAddressForRow + Y_SPACING + PADDING * 2;
      tallestAddressForRow = -1;
      if ((yCursor + addressHeight) > Y_LIMIT) {
        // Create new page
        const canvas = document.createElement('canvas');
        extraCanvasContainer.append(canvas);
        setDPI(canvas, DPI);
        ctx = canvas.getContext('2d');
        yCursor = Y_START_MARGIN;
        xCursor = X_START_MARGIN;
      }
    }
    
    // Draw bounding box

    // Draws a plain rectangle

    // ctx.fillRect(xCursor, yCursor - nameSize.actualBoundingBoxAscent, longestLineWidth, addressHeight);

    const rectStartX = xCursor - PADDING;
    const rectStartY = yCursor - nameSize.fontBoundingBoxAscent - PADDING;
    ctx.fillStyle = 'white';
    ctx.fillRect(rectStartX, rectStartY, longestLineWidth + PADDING * 2, addressHeight + PADDING * 2);

    ctx.font = FONT_STYLE;
    ctx.fillStyle = 'black';

    let innerYCursor = yCursor;
    ctx.fillText(name, xCursor, innerYCursor);
    innerYCursor += nameHeight + LINE_SPACING;

    ctx.fillText(street, xCursor, innerYCursor);
    innerYCursor += streetHeight+ LINE_SPACING;
    
    ctx.fillText(lastLine, xCursor, innerYCursor);
    innerYCursor += lastLineHeight;

    xCursor += longestLineWidth + X_SPACING + PADDING * 2;
  }
}

function inchToPixels(inch) {
  return inch * PIXELS_PER_INCH;
}

function getHeightFromTextMetrics(textMetrics) {
  return textMetrics.fontBoundingBoxDescent + textMetrics.fontBoundingBoxAscent;
}

function downloadCanvas(canvas){
  var link = document.createElement('a');
  link.download = 'filename.png';
  link.href = canvas.toDataURL()
  link.click();
}
