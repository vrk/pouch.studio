let msSinceAnimation = 0;
const MsTillAnimation = 4000;

const beepboop = {
  type: "tuple",
  totalDuration: 2500,
  meBubbleAppear: 500,
  compBubbleAppear: 900,
  meBeep: document.getElementById('me-beep'),
  compBoop: document.getElementById('comp-boop')
}

const error = {
  type: "triplet",
  totalDuration: 3000,
  meBubbleAppear: 500,
  compBubbleAppear: 900,
  meBubbleAppearAgain: 1400,
  meBeep: document.getElementById('me-beep'),
  compBoop: document.getElementById('comp-exclaim'),
  meBeepAgain: document.getElementById('me-exclaim'),
}

const animations = [
  beepboop,
  error
];

let beepMsSinceStart = 0;

let animationInProgress = false;
let animationIndex = 0;

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

  if (beepMsSinceStart === currentAnimation.totalDuration) {
    beepMsSinceStart = 0;
    msSinceAnimation = 0;
    animationInProgress = false;
    currentAnimation.meBeep.hidden = true;
    currentAnimation.compBoop.hidden = true;
    if (currentAnimation.meBeepAgain) {
      currentAnimation.meBeepAgain.hidden = true;
    }
    animationIndex = (animationIndex + 1) % animations.length;
    return;
  }
  if (beepMsSinceStart === currentAnimation.meBubbleAppear) {
    currentAnimation.meBeep.hidden = false;
  }
  if (beepMsSinceStart === currentAnimation.compBubbleAppear) {
    currentAnimation.compBoop.hidden = false;
  }
  if (currentAnimation.meBubbleAppearAgain && currentAnimation.meBubbleAppearAgain === beepMsSinceStart) {
    currentAnimation.meBeep.hidden = true;
    currentAnimation.meBeepAgain.hidden = false;
  }
}

const timer = setInterval(runloop, 100);
