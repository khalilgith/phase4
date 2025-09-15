// Game state variables
let flippedCards = [];
let matchedCards = [];
let canFlip = true;
let moves = 0;
let score = 0;
let timer;              
let seconds = 0;        
let isTimerRunning = false;

// Card symbols array
const cardSymbols = [
    '🎯', '🎨', '🎭', '🎪', '🚀', '⭐', '🌟', '🎈',
    '🎯', '🎨', '🎭', '🎪', '🚀', '⭐', '🌟', '🎈'
];

// Shuffle function to randomly assign symbols
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create the game board with cards
function createGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    const shuffledSymbols = shuffleArray(cardSymbols);

    // Reset game state
    resetGame();
    
    // Clear existing cards
    gameBoard.innerHTML = '';

    // Create 16 cards (4x4 grid)
    for (let i = 0; i < 16; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.symbol = shuffledSymbols[i];
        card.dataset.index = i;

        // 2. CARD WITH FRONT AND BACK FACE
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front"></div>
                <div class="card-face card-back">${shuffledSymbols[i]}</div>
            </div>
        `;

        // Add click event to flip card
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    }
    
    updateMatchesCount();
}

// Flip a card
function flipCard(card) {
    if (!canFlip || card.classList.contains('matched') || card.classList.contains('flipped')) {
        return;
    }

    // Start timer on first card flip
    if (!isTimerRunning) {
        startTimer();
    }

    card.classList.add('flipped');
    flippedCards.push(card);
    moves++;
    updateMovesCount();

    if (flippedCards.length === 2) {
        canFlip = false;
        checkForMatch();
    }
}

// Check for a match
function checkForMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.symbol === card2.dataset.symbol;

    if (match) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
        score += 10;
        updateScore();
        updateMatchesCount();
        
        // Check if game is complete
        if (matchedCards.length === cardSymbols.length) {
            gameComplete();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            score = Math.max(0, score - 1);
            updateScore();
        }, 1000);
    }

    setTimeout(() => {
        flippedCards = [];
        canFlip = true;
    }, 1000);
}

function gameComplete() {
    stopTimer();
    const finalScore = calculateFinalScore();
    setTimeout(() => {
        alert(`Congratulations! \nTime: ${seconds}s\nMoves: ${moves}\nFinal Score: ${finalScore}`);
    }, 500);
}

function calculateFinalScore() {
    return Math.max(0, score + (1000 - (moves * 10) - (seconds * 5)));
}

function updateMovesCount() {
    document.getElementById('movesCount').textContent = moves;
}

function updateScore() {
    document.getElementById('totalScore').textContent = score;
}

function updateMatchesCount() {
    document.getElementById('matchesCount').textContent = `${matchedCards.length/2}/8`;
}

// Demo functions (updated for Phase 2)
function flipRandomCard() {
    const unflippedCards = document.querySelectorAll('.card:not(.flipped):not(.matched)');
    if (unflippedCards.length > 0 && canFlip) {
        const randomIndex = Math.floor(Math.random() * unflippedCards.length);
        flipCard(unflippedCards[randomIndex]);
    }
}

function flipAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (!matchedCards.includes(card)) {
            card.classList.add('flipped');
        }
    });
}

function resetGame() {
    // Reset all game state
    flippedCards = [];
    matchedCards = [];
    canFlip = true;
    moves = 0;
    score = 0;
    stopTimer();
    seconds = 0;
    updateMovesCount();
    updateScore();
    updateMatchesCount();
    document.getElementById('timer').textContent = 'Time: 0s';
}

function resetCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('flipped', 'matched');
    });
    resetGame();
}

function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timer = setInterval(() => {
            seconds++;
            document.getElementById('timer').textContent = `Time: ${seconds}s`;
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timer);
    isTimerRunning = false;
}

// New function to restart the entire game
function restartGame() {
    createGameBoard();
}

// Initialize the game board when page loads
document.addEventListener('DOMContentLoaded', createGameBoard);