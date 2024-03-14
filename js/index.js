let msSinceAnimation = 0;
const MsTillAnimation = 4000;

const beepboop = {
  totalDuration: 2500,
  meBubbleAppear: 500,
  compBubbleAppear: 900,
  meBeep: document.getElementById('me-beep'),
  compBoop: document.getElementById('comp-boop')
}

let beepMsSinceStart = 0;

let animationInProgress = false;

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

  if (beepMsSinceStart === beepboop.totalDuration) {
    beepMsSinceStart = 0;
    msSinceAnimation = 0;
    animationInProgress = false;
    beepboop.meBeep.hidden = true;
    beepboop.compBoop.hidden = true;
    return;
  }
  if (beepMsSinceStart === beepboop.meBubbleAppear) {
    beepboop.meBeep.hidden = false;
  }
  if (beepMsSinceStart === beepboop.compBubbleAppear) {
    beepboop.compBoop.hidden = false;
  }
}

const timer = setInterval(runloop, 100);
