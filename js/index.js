let msSinceAnimation = 2500; // hack to make first animation start earlier
const MsTillAnimation = 3000;

const compBeep = document.getElementById('comp-beep');
const compBoop = document.getElementById('comp-boop');
const compExclaim = document.getElementById('comp-exclaim');
const compFire1 = document.getElementById('comp-fire1');
const compFire2 = document.getElementById('comp-fire2');
const compNote = document.getElementById('comp-note');
const compMeToo = document.getElementById('comp-metoo');
const meBeep = document.getElementById('me-beep');
const meBoop = document.getElementById('me-boop');
const meExclaim = document.getElementById('me-exclaim');
const meLovePaper = document.getElementById('me-lovepaper');
const meNote = document.getElementById('me-note');
const meOop = document.getElementById('me-oop');

const beepBoopSequence = [
  {
    duration: 400,
    graphic: meBeep,
    shouldHide: false
  },
  {
    duration: 400,
    graphic: compBoop,
    shouldHide: false 
  },
  {
    duration: 1100,
    graphic: null
  },
];

const beepboop = {
  type: "tuple",
  totalDuration: 2500,
  meBubbleAppear: 500,
  compBubbleAppear: 900,
}

const lovepaper = {
  type: "tuple",
  totalDuration: 4500,
  meBubbleAppear: 500,
  compBubbleAppear: 1900,
  meBeep: document.getElementById('me-lovepaper'),
  compBoop: document.getElementById('comp-metoo')
}

const error = {
  type: "triplet",
  totalDuration: 4800,
  meBubbleAppear: 500,
  meBubbleDisappear: 1500,
  compBubbleAppear: 2800,
  meBubbleAppearAgain: 3200,
  meBeep: document.getElementById('me-beep'),
  compBoop: document.getElementById('comp-exclaim'),
  meBeepAgain: document.getElementById('me-exclaim'),
}

const ding = {
  type: "comp2-ding",
  totalDuration: 4800,
  compAppear1: 2800,
  compAppear2: 3200,
  meBeep: document.getElementById('me-beep'),
  compBoop: document.getElementById('comp-exclaim'),
  meBeepAgain: document.getElementById('me-exclaim'),
}

// const animations = [
//   beepboop,
//   error,
//   lovepaper,
// ];

const animations = [
  beepBoopSequence,
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
  if (beepMsSinceStart === frame.duration) {
    if (frame.graphic) {
      frame.graphic.hidden = frame.shouldHide;
    }
    currentFrame++;
    beepMsSinceStart = 0;
  }

  if (currentFrame === currentAnimation.length) {
    currentFrame = 0;
    beepMsSinceStart = 0;
    animationIndex = (animationInProgress + 1) % animations.length;
    msSinceAnimation = 0;
    animationInProgress = false;
    const mebubbles = document.querySelectorAll('#mebubble img');
    mebubbles.forEach(e => e.hidden = true);
    const compbubbles = document.querySelectorAll('#computerbubble img');
    compbubbles.forEach(e => e.hidden = true);
    animationIndex = (animationIndex + 1) % animations.length;
  }
}

const handleTupleTriplet = (currentAnimation) => {
  if (beepMsSinceStart === currentAnimation.meBubbleAppear) {
    currentAnimation.meBeep.hidden = false;
  }
  if (beepMsSinceStart === currentAnimation.compBubbleAppear) {
    currentAnimation.compBoop.hidden = false;
  }
  if (currentAnimation.meBubbleDisappear && currentAnimation.meBubbleDisappear === beepMsSinceStart) {
    currentAnimation.meBeep.hidden = true;
  }
  if (currentAnimation.meBubbleAppearAgain && currentAnimation.meBubbleAppearAgain === beepMsSinceStart) {
    currentAnimation.meBeep.hidden = true;
    currentAnimation.meBeepAgain.hidden = false;
  }
}

const timer = setInterval(runloop, 100);
