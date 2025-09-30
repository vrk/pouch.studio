// GLOBALS

const containerDiv = document.getElementById('container');
const MAX_WIDTH = 1600;

// FUNCTIONS

const onResize = () => {
  scaleContainer();
}

const scaleContainer = () => {
  if (window.innerWidth < MAX_WIDTH) {
    const scaleVal = window.innerWidth / MAX_WIDTH
    containerDiv.style.transform = `scale(${scaleVal})`;
    containerDiv.style.width = `1600px`;
  } else {
    containerDiv.style.transform = '';
    containerDiv.style.width = '';
  }
}

// MAIN

window.addEventListener('resize', onResize);
scaleContainer();