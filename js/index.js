let msSinceAnimation = 1900; // hack to make first animation start earlier
const MsTillAnimation = 3000;

const beepboop = {
  type: "tuple",
  totalDuration: 2500,
  meBubbleAppear: 500,
  compBubbleAppear: 900,
  meBeep: document.getElementById('me-beep'),
  compBoop: document.getElementById('comp-boop')
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
  compBubbleAppear: 2800,
  meBubbleAppearAgain: 3200,
  meBeep: document.getElementById('me-beep'),
  compBoop: document.getElementById('comp-exclaim'),
  meBeepAgain: document.getElementById('me-exclaim'),
}

const animations = [
  beepboop,
  error,
  lovepaper,
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
    const mebubbles = document.querySelectorAll('#mebubble img');
    mebubbles.forEach(e => e.hidden = true);
    const compbubbles = document.querySelectorAll('#computerbubble img');
    compbubbles.forEach(e => e.hidden = true);
    animationIndex = (animationIndex + 1) % animations.length;
    return;
  }

  if (currentAnimation.type === 'tuple' || currentAnimation.type === 'triplet') {
    handleTupleTriplet(currentAnimation);
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
