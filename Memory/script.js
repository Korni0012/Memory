const board = document.querySelector('#board');
const startBtn = document.querySelector('#startBtn');
let rows = 2;
let cols = 4;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

const imageFiles = [
    'Wingman.jpg',
    'Miku.jpg',
    'Creeper.avif',
    'AmongUs.png',
    'Cebula.jpg',
    'Meowl.jpg',
    'Kevin.jpg',
    'Llama.jpg'
];

function play(selectedRows, selectedCols) {
    rows = selectedRows;
    cols = selectedCols;

    board.className = '';
    board.classList.add(`size_${rows}x${cols}`);
    board.innerHTML = '';

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    startBtn.disabled = false;
    startBtn.textContent = 'START';
}

function startGame() {

    board.innerHTML = '';
    board.className = '';
    board.classList.add(`size_${rows}x${cols}`);
    startBtn.disabled = false;
    startBtn.textContent = 'RESTART';

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    const cards = generateShuffledDeck(rows * cols);

    cards.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.dataset.img = getCardImage(value);
        card.style.backgroundImage = '';
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
        card.innerText = '';
        card.addEventListener('click', () => revealCard(card));
        board.appendChild(card);
    });
}

function generateShuffledDeck(size) {
    const pairCount = size / 2;
    const deck = [];

    for (let value = 1; value <= pairCount; value += 1) {
        deck.push(value, value);
    }

    return shuffle(deck);
}

function getCardImage(value) {
    const index = (value - 1) % imageFiles.length;
    return `pictures/${imageFiles[index]}`;
}

function shuffle(array) {
    const result = array.slice();

    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function revealCard(card) {
    if (lockBoard || card === firstCard || card.classList.contains('hit') || card.classList.contains('discovered')) {
        return;
    }

    card.classList.add('discovered');
    card.style.backgroundImage = `url("${card.dataset.img}")`;
    card.innerText = '';

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockBoard = true;

    if (firstCard.dataset.value === secondCard.dataset.value) {
        markAsFound();
    } else {
        hideCards();
    }
}

function markAsFound() {
    firstCard.classList.add('hit');
    secondCard.classList.add('hit');

    resetSelection();
}

function hideCards() {
    setTimeout(() => {
        firstCard.classList.remove('discovered');
        secondCard.classList.remove('discovered');
        firstCard.style.backgroundImage = '';
        secondCard.style.backgroundImage = '';
        firstCard.innerText = '';
        secondCard.innerText = '';
        resetSelection();
    }, 750);
}

function resetSelection() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

document.addEventListener('DOMContentLoaded', () => {
    play(rows, cols);
});