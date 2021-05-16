const btnElement = document.querySelector('.button');
const clicksElement = document.querySelector('#score');
const cpsElement = document.querySelector('#cps');
const maxCpsElement = document.querySelector('#max-cps');
const lvlElement = document.querySelector('#lvl');
const conditionElement = document.querySelector('#condition');

const clickSound = new Audio('./sounds/click.mp3');
const lvlUpSound = new Audio('./sounds/lvlUp.mp3');

const LVL_UPS = [[
        "10 CLICKS",
        (clicks, cps) => clicks >= 10
    ], [
        "100 CLICKS",
        (clicks, cps) => clicks >= 100
    ], [
        "500 CLICKS",
        (clicks, cps) => clicks >= 500
    ], [
        "10 CLICKS",
        (clicks, cps) => cps >= 10
    ], [
        "1 000 CLICKS",
        (clicks, cps) => clicks >= 1000
    ], [
        "1 500 CLICKS",
        (clicks, cps) => clicks >= 1500
    ], [
        "12 CPS",
        (clicks, cps) => cps >= 12
    ], [
        "12 CPS & 3 000 CLICKS",
        (clicks, cps) => clicks >= 3000
    ], [
        "5 000 CLICKS",
        (clicks, cps) => clicks >= 5000
]]

class Cps {
    #clicks = [];
    #max = +localStorage.getItem('max-cps') || 0;
    get max() {
        return this.#max;
    }
    get count() {
        return this.#clicks.length;
    }
    update() {
        this.#clicks = [ ...this.#clicks, Date.now() ].filter(i => Date.now() <= i+1000);
        const max = Math.max(this.max, this.count);
        if(this.max !== max) {
            localStorage.setItem('max-cps', max);
            this.#max = max;
        }
    }
}

class Clicker {
    #cps = new Cps();
    constructor() {
        this.clicks = +localStorage.getItem('clicks') || 0;
    }
    get maxCPS() {
        return this.#cps.max;
    }
    get cps() {
        return this.#cps.count;
    }
    click() {
        this.#cps.update();
        this.clicks++;
        localStorage.setItem('clicks', this.clicks);
    }
}

const clicker = new Clicker();

function lvlSystem() {
    let lvl = 0;
    for(let [, condition] of LVL_UPS) {
        lvl++;
        if(!condition(clicker.clicks, clicker.cps)) break;
    }
    return {
        lvl: lvl < LVL_UPS.length ? lvl : 'MAX',
        condition: LVL_UPS[lvl-1]?.[0] || 'DONE'
    }
}

let lvl = lvlSystem().lvl;
let condition = lvlSystem().condition;

function render() {
    maxCpsElement.textContent = clicker.maxCPS;
    cpsElement.textContent = clicker.cps;
    lvlElement.textContent = lvl;
    conditionElement.textContent = condition;
    clicksElement.textContent = clicker.clicks;
}

render();

btnElement.onclick = function() {
    
    clicker.click();
    clickSound.currentTime = 0;
    clickSound.play();


    const system = lvlSystem(); 
    condition = system.condition;

    if(system.lvl > lvl) lvlUpSound.play();
    lvl = system.lvl;

    render();
}
