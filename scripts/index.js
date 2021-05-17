const BUTTON = document.querySelector('#button1');
const BUTTON2 = document.querySelector('#button2');
const PREBUTTON = document.querySelector('#nextStageButton')

const SCORE = document.querySelector('#score');
const CPS = document.querySelector('#cps');
const MAX_CPS = document.querySelector('#max-cps');
const LVL = document.querySelector('#lvl');
const CONDITION = document.querySelector('#condition');

const SCORE2 = document.querySelector('#score2');
const LVL2 = document.querySelector('#lvl2');
const CONDITION2 = document.querySelector('#condition2');
const MAX = document.querySelector('#max');
const CHANSE = document.querySelector('#chance')

const nextStageSound = new Audio('./sounds/nextStage.mp3');
const nextStageClickSound = new Audio('./sounds/nextStageClick.mp3');
const clickSound = new Audio('./sounds/click.mp3');
const click2Sound = new Audio('./sounds/click2.mp3');
const lvlUpSound = new Audio('./sounds/lvlUp.mp3');
const succesSound = new Audio('./sounds/success.mp3');
const failSound = new Audio('./sounds/fail.mp3');

let pressed = new Set();

let score = localStorage.getItem('clicker:score') || 0;
let cps = { in: 0, out: 0, max: localStorage.getItem('clicker:max') };
let lvl = localStorage.getItem('clicker:lvl') || 1;
let stage = localStorage.getItem('clicker:stage') || 1;
let max = 0;


const lvlUP = [{
        req: "10 CLICKS",
        cond: () => score >= 10
    },
    {
        req: "100 CLICKS",
        cond: () => score >= 100
    },
    {
        req: "500 CLICKS",
        cond: () => score >= 500
    },
    {
        req: "10 CPS",
        cond: () => cps.out >= 10
    },
    {
        req: "10 CPS 1 000 CLICKS",
        cond: () => cps.out >= 10 && score >= 1000
    },
    {
        req: "1 500 CLICKS",
        cond: () => score >= 1500
    },
    {
        req: "12 CPS",
        cond: () => cps.out >= 12
    },
    {
        req: "2000 CLICKS",
        cond: () => score >= 2000
    },
    {
        req: "12 CPS 3 000 CLICKS",
        cond: () => cps.out >= 12 && score >= 3000
    },
    {
        req: "3500 CLICKS",
        cond: () => score >= 3500
    },
    {
        req: "4000 CLICKS",
        cond: () => score >= 4000
    },
    {
        req: "5 000 CLICKS",
        cond: () => score >= 5000
    },
    {
        req: "13 CPS",
        cond: () => cps.out >= 13
    },
    {
        req: "13 CPS 6500 CLICKS",
        cond: () => cps.out >= 13 && score >= 6500
    },
    {
        req: "7000 CLICKS",
        cond: () => score >= 7000
    },
    {
        req: "8500 CLICKS",
        cond: () => score >= 8500
    },
    {
        req: "14 CPS",
        cond: () => cps.out >= 14
    },
    {
        req: "10 000 CLICKS",
        cond: () => score >= 10000
    },
    {
        req: "14 CPS",
        cond: () => cps.out >= 14
    },
    {
        req: "14 CPS 15 000 CLICKS",
        cond: () => cps.out >= 14 && score >= 15000
    },
    {
        req: "15 CPS",
        cond: () => cps.out >= 14
    },
]
const lvlUP2 = [{
        req: "10 SCORE",
        cond: () => score >= 10
    },
    {
        req: "50 SCORE",
        cond: () => score >= 100
    },
    {
        req: "5 MAX",
        cond: () => max >= 5
    },
    {
        req: "7 MAX",
        cond: () => max >= 7
    },
    {
        req: "100 SCORE",
        cond: () => score >= 100
    },
    {
        req: "150 SCORE 5 MAX",
        cond: () => score >= 150 && max >= 5
    },
    {
        req: "200 SCORE",
        cond: () => score >= 200
    },
    {
        req: "10 MAX",
        cond: () => max >= 10
    },
    {
        req: "10 MAX && 500 SCORE",
        cond: () => score >= 500 && max >= 10
    },
]

function update() {
    MAX_CPS.textContent = cps.max;
    LVL.textContent = lvlUP[lvl - 1] ? lvl : 'MAX';
    CONDITION.textContent = `${lvlUP[lvl-1] ? lvlUP[lvl-1].req: 'DONE'}`;
    SCORE.textContent = score.toLocaleString().replace(/,/g, ' ');

    localStorage.setItem('clicker:score', score);
    localStorage.setItem('clicker:max', cps.max);
    localStorage.setItem('clicker:lvl', lvl);
    localStorage.setItem('clicker:stage', stage)
}

function nextStage() {
    nextStageSound.play()
    let preStage = document.querySelector(`.prestage`);
    let currentStage = document.querySelector(`.stage${+stage}`);
    currentStage.style.display = 'none';
    preStage.style.display = 'block'
}

function loadStage() {
    document.querySelector(`.stage${+stage}`).style.display = 'block';
}

BUTTON.onclick = function() {
    if (pressed.size != 0) return;
    clickSound.currentTime = 0;
    clickSound.play();

    score++;
    cps.in++;

    update();

    if (lvlUP[lvl - 1] ? lvlUP[lvl - 1].cond() : false) {
        lvl++
        lvlUpSound.play();
    }
    if (!lvlUP[lvl - 1]) {
        nextStage();
    }
}

BUTTON2.onclick = function() {
    if (pressed.size != 0) return;
    click2Sound.currentTime = 0;
    click2Sound.play();
    move()
}

PREBUTTON.onclick = function() {
    nextStageClickSound.play()
    let preStage = document.querySelector(`.prestage`);
    let currentStage = document.querySelector(`.stage${+stage}`);
    let nextStage = document.querySelector(`.stage${+stage+1}`);
    if (!nextStage) return alert('Вы достигли максимальной стадии развития!.,@');
    preStage.style.display = 'none';
    currentStage.style.display = 'none';
    stage++;
    localStorage.setItem('clicker:stage', stage);
    lvl = 1
    score = 0;
    loadStage();
}

update();
loadStage();
if (stage == 2) {
    SCORE2.textContent = score.toLocaleString().replace(/,/g, ' ');
    LVL.textContent = lvlUP2[lvl - 1] ? lvl : 'MAX';
    CONDITION2.textContent = `${lvlUP2[lvl-1] ? lvlUP2[lvl-1].req: 'DONE'}`;
    MAX.textContent = max;
}
setInterval(() => {
    cps.out = cps.in;
    CPS.textContent = cps.out;
    cps.in = 0;

    if (cps.out > cps.max) cps.max = cps.out;
}, 1000)

window.addEventListener('keydown', key => {
    if (!pressed.has(key.key)) pressed.add(key.key)
})
window.addEventListener('keyup', key => {
    if (pressed.has(key.key)) pressed.delete(key.key)
})

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function move() {
    let elem = document.getElementById("greenBar");
    if (parseInt(elem.style.width) > 0) return
    let width = 0;
    let id = setInterval(frame, 30);

    function frame() {
        if (width >= 100) {
            clearInterval(id);
            elem.style.width = 0 + '%'
            if (random(0, 100) >= 50) {
                succesSound.play()
                score++;
                max++
            } else {
                failSound.play();
                max = 0;
            }
            if (lvlUP2[lvl - 1] ? lvlUP2[lvl - 1].cond() : false) {
                lvl++
                lvlUpSound.play();
            }
            if (!lvlUP2[lvl - 1]) {
                nextStage();
            }
            localStorage.setItem('clicker:score', score);
            localStorage.setItem('clicker:lvl', lvl);
            SCORE2.textContent = score.toLocaleString().replace(/,/g, ' ');
            LVL.textContent = lvlUP2[lvl - 1] ? lvl : 'MAX';
            CONDITION2.textContent = `${lvlUP2[lvl-1] ? lvlUP2[lvl-1].req: 'DONE'}`;
            MAX.textContent = max;
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}