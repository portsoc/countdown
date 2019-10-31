const BIG_NUMBERS = [25, 50, 75, 100];
const SMALL_NUMBERS = [ 1, 1, 2, 2, 3, 3, 4, 4, 5, 5,
                        6, 6, 7, 7, 8, 8, 9, 9, 10, 10];

const DELAY_BETWEEN_TILES = 500;
const DELAY_SPINNER = 5000;
const DELAY_AFTER_TILE_REVEAL = 500;
const DELAY_BEFORE_CLOCK_START = 1000;

const bigBtn = document.querySelector('#big');
const startBtn = document.querySelector('#start');
const targetEl = document.querySelector('#random .random-numberbox');
const numberBoxes = document.querySelectorAll('#numbers .numberbox');

let selectedNumbers;
let remainingBigNumbers;
let remainingSmallNumbers;
let started;
let target;

function init() {
  console.log('initing');
  started = false;
  selectedNumbers = [];
  remainingBigNumbers = BIG_NUMBERS.slice();
  remainingSmallNumbers = SMALL_NUMBERS.slice();
  target = '000';
  updateUI();
}

function updateUI() {
  if (started) {
    // we have started
    document.body.classList.add('stage2');
    document.body.classList.remove('stage1');

    targetEl.textContent = target;
  } else {

    // we have not started
    for (let i=0; i<numberBoxes.length; i+=1) {
      numberBoxes[i].classList.toggle('filled', selectedNumbers[i] != null);
    }

    document.body.classList.add('stage1');
    document.body.classList.remove('stage2');

    targetEl.textContent = '000';
  }
}


bigBtn.addEventListener('click', addBigNumber);
startBtn.addEventListener('click', startGame);
init();
console.log('game is now set up');

function addBigNumber() {
  const num = selectRandom(remainingBigNumbers);
  selectedNumbers.push(num);
  if (remainingBigNumbers.length === 0) {
    bigBtn.disabled = true;
    bigBtn.title = "already added 4 numbers";
  }
  updateUI();
}

function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

function addSmallNumber() {
  const num = selectRandom(remainingSmallNumbers);
  selectedNumbers.push(num);
  updateUI();
}

function populateTiles() {
  for (let i=0; i<6; i+=1) {
    numberBoxes[i].textContent = selectedNumbers[i];
  }
  updateUI();
}

function spinAndGenerateTarget() {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    requestAnimationFrame(function spinner() {
      if ((Date.now() - startTime) < DELAY_SPINNER) {
        generateRandomNumber();
        requestAnimationFrame(spinner);
      } else {
        resolve();
      }
    })
  });
}

function generateRandomNumber() {
  target = Math.floor(Math.random()*900) + 100;
  updateUI();
}

function selectRandom(arr) {
  const index = Math.floor(Math.random()*arr.length);
  const retval = arr[index];

  // remove the selected element
  arr.splice(index, 1);

  return retval;
}

async function startGame() {
  startBtn.disabled = true;
  bigBtn.disabled = true;

  while (selectedNumbers.length < 6) {
    addSmallNumber();
    await delay(DELAY_BETWEEN_TILES);
  }

  started = true;
  populateTiles();
  await delay(DELAY_AFTER_TILE_REVEAL);
  await spinAndGenerateTarget();

  await delay(DELAY_BEFORE_CLOCK_START);

  startClock();
}




/* clock
 *
 *
 *    ####  #       ####   ####  #    #
 *   #    # #      #    # #    # #   #
 *   #      #      #    # #      ####
 *   #      #      #    # #      #  #
 *   #    # #      #    # #    # #   #
 *    ####  ######  ####   ####  #    #
 *
 *
 */
const anglePerSecond = 180/30;
const centre = {x:200, y:200};
const rotateElSmooth = document.getElementById('handpointer');
const rotateElChoppy = document.getElementById('blanker');
const audio = document.querySelector('audio');

let startTime;
async function startClock() {
  startTime = Date.now();
  await audio.play();
  rotate();
}
function rotate() {
  const angleSmooth = (Date.now()-startTime)/1000*anglePerSecond;
  const angleChoppy = angleSmooth - (angleSmooth % anglePerSecond);
  rotateElSmooth.setAttribute('transform', `rotate(${angleSmooth})`);
  rotateElChoppy.setAttribute('transform', `rotate(${angleChoppy})`);
  if (angleSmooth < 180) requestAnimationFrame(rotate);
}
// document.addEventListener('click', init);
