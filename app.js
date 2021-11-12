let question = document.querySelector('.input input');
let playGround = document.querySelector('.play');
let timerDiv = document.querySelector('.timer');
let cluePositions = [];
let word = '';
let maxTries = 0;
let userTries = 0;
let counter = 0;
let timer = null;
let App = {};


playGround.addEventListener('keyup', (e) => {
    if (e.target.nodeName != 'INPUT') {
        return
    }
    e.target.value = e.target.value.replace(/\W|\d/g, '').substr(0, 1).toUpperCase();
});


playGround.addEventListener('change', (e) => {
    let p = e.target.dataset['pos'];
    if (p === undefined) {
        return
    }
    p = parseInt(p, 10);

    let boxValue = e.target.value.toUpperCase();

    if (boxValue === word[p].toUpperCase()) {
        e.target.style.borderBottom = '5px solid green';
    } else {
        userTries += 1;
        e.target.style.borderBottom = '5px solid red';
    }
    updateStatus();
});


question.addEventListener('change', (e) => {
    word = e.target.value;
    question.value = '';
    question.disabled = true;
    maxTries = (word.length - Math.floor(word.length / 2)) * 2;
    updateStatus();
    startGame();
});


function updateStatus() {
    let status = document.querySelector('.status');
    let _word = ''
    playGround.querySelectorAll('input.box').forEach((d) => {
        _word += d.value.toUpperCase();
    });

    let children = status.childNodes;
    for (let c=0; c < children.length; c++) {
        status.removeChild(children[c]);
    }
    let message = `<b>Game Over!</b> The word was ${word.toUpperCase()}`;
    if (userTries < maxTries) {
        message = `<b>${userTries}/${maxTries}</b>`;
    }
    if (_word == word.toUpperCase()) {
        message = '<h3> You win! </h3>';
        clearInterval(timer);
    }
    if (userTries >= maxTries) {
        clearInterval(timer);
    }
    let d = document.createElement('span');
    d.innerHTML = message;
    status.appendChild(d);
}

function startGame() {
    let maxClues = Math.floor(word.length / 2);
    while (cluePositions.length < maxClues) {
        let k = Math.floor(Math.random() * word.length);
        if (cluePositions.indexOf(k) == -1) {
            cluePositions.push(k);
        }
    }

    for (let i=0; i < word.length; i++) {
        let child = document.createElement('input');
        child.attributes['type'] = 'text';
        child.className = `box`;
        child.dataset['pos'] = i;
        playGround.appendChild(child);
    }
    cluePositions.forEach((e) => {
        let node = playGround.querySelector(`[data-pos="${e}"]`);
        node.value = word[e];
        node.disabled= true;
    });
    timer = setInterval(startTimer, 1000);
}

function startTimer() {
    counter += 1;
    let sec = (counter % 60).toString().padStart(2, '0');
    let min = Math.floor(counter / 60).toString().padStart(2, '0');
    timerDiv.innerHTML = `<span>${min}:${sec}</span>`;
}