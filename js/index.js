let msSinceAnimation = 2900; // hack to make first animation start earlier
const MsTillAnimation = 3000;

const compElements = {
  beep: document.getElementById('comp-beep'),
  boop: document.getElementById('comp-boop'),
  exclaim: document.getElementById('comp-exclaim'),
  fire1: document.getElementById('comp-fire1'),
  fire2: document.getElementById('comp-fire2'),
  note: document.getElementById('comp-note'),
  meToo: document.getElementById('comp-metoo'),
}

const meElements = {
  beep: document.getElementById('me-beep'),
  boop: document.getElementById('me-boop'),
  exclaim: document.getElementById('me-exclaim'),
  lovePaper: document.getElementById('me-lovepaper'),
  note: document.getElementById('me-note'),
  oop: document.getElementById('me-oop'),
}

const beepBoopSequence = [
  {
    duration: 400,
    graphic: meElements.beep,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.boop,
    shouldHide: false 
  },
  {
    duration: 1100,
    graphic: null
  },
];

const lovePaperSequence = [
  {
    duration: 1000,
    graphic: meElements.lovePaper,
    shouldHide: false
  },
  {
    duration: 2000,
    graphic: compElements.meToo,
    shouldHide: false 
  },
];

const errorSequence = [
  {
    duration: 400,
    graphic: meElements.beep,
    shouldHide: false
  },
  {
    duration: 200,
    graphic: compElements.exclaim,
    shouldHide: false
  },
  {
    duration: 1500,
    graphic: meElements.exclaim,
    shouldHide: false
  },
];

const singSequence = [
  {
    duration: 400,
    graphic: compElements.beep,
    shouldHide: false
  },
  {
    duration: 100,
    graphic: compElements.beep,
    shouldHide: true
  },
  {
    duration: 400,
    graphic: compElements.beep,
    shouldHide: false
  },
  {
    duration: 100,
    graphic: compElements.beep,
    shouldHide: true
  },
  {
    duration: 400,
    graphic: compElements.boop,
    shouldHide: false
  },
  {
    duration: 100,
    graphic: compElements.beep,
    shouldHide: true
  },
  {
    duration: 800,
    graphic: meElements.note,
    shouldHide: false
  },
  {
    duration: 1200,
    graphic: compElements.note,
    shouldHide: false
  },
];

const fireSequence = [
  {
    duration: 1000,
    graphic: meElements.beep,
    shouldHide: false
  },
  {
    duration: 1500,
    graphic: meElements.beep,
    shouldHide: true
  },
  {
    duration: 400,
    graphic: compElements.fire1,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire2,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire1,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire2,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire1,
    shouldHide: false
  },
  {
    duration: 300,
    graphic: compElements.fire2,
    shouldHide: false
  },
  {
    duration: 100,
    graphic: meElements.oop,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire1,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire2,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire1,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire2,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire1,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire1,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire2,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire1,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire2,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire1,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compElements.fire2,
    shouldHide: false
  },
];

const animations = [
  beepBoopSequence,
  errorSequence,
  singSequence,
  fireSequence,
  lovePaperSequence,
];

let beepMsSinceStart = 0;

let animationInProgress = false;
let animationIndex = 0;
let currentFrame = 0;

const runloop = async () => {
  if (!animationInProgress) {
    msSinceAnimation += 100;
    if (msSinceAnimation % MsTillAnimation === 0) {
      animationInProgress = true;
    }
    return;
  } 
  // Animation is in progress
  beepMsSinceStart += 100;

  const currentAnimation = animations[animationIndex];

  const frame = currentAnimation[currentFrame];
  if (frame.graphic) {
    const parent = isComputerElement(frame.graphic) ? compElements : meElements;
    Object.values(parent).forEach(e => e.hidden = true);
    frame.graphic.hidden = frame.shouldHide;
  }
  if (beepMsSinceStart === frame.duration) {
    currentFrame++;
    beepMsSinceStart = 0;
  }

  if (currentFrame === currentAnimation.length) {
    currentFrame = 0;
    beepMsSinceStart = 0;
    msSinceAnimation = 0;
    animationInProgress = false;
    const mebubbles = document.querySelectorAll('#mebubble img');
    mebubbles.forEach(e => e.hidden = true);
    const compbubbles = document.querySelectorAll('#computerbubble img');
    compbubbles.forEach(e => e.hidden = true);
    animationIndex = (animationIndex + 1) % animations.length;
  }
}

function isComputerElement(element) {
  return Object.values(compElements).includes(element);
}

function isMeElement(element) {
  return Object.values(meElements).includes(element);
}

const timer = setInterval(runloop, 100);
