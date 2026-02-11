// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timerInterval;
let seconds = 0;

// Card symbols (hearts and romantic emojis)
const symbols = ['❤️', '💕', '💖', '💗', '💝', '💘', '💓', '💞'];

// Initialize game
function initGame() {
    // Reset game state
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    flippedCards = [];
    
    // Update UI
    document.getElementById('moves').textContent = '0';
    document.getElementById('timer').textContent = '0:00';
    document.getElementById('victoryModal').classList.remove('show');
    
    // Clear timer if exists
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Create card pairs and shuffle using Fisher-Yates algorithm
    const cardSymbols = [...symbols, ...symbols];
    
    // Fisher-Yates shuffle
    for (let i = cardSymbols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardSymbols[i], cardSymbols[j]] = [cardSymbols[j], cardSymbols[i]];
    }
    
    cards = cardSymbols.map((symbol, index) => ({
        id: index,
        symbol: symbol,
        flipped: false,
        matched: false
    }));
    
    // Render game board
    renderBoard();
}

// Render game board
function renderBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.index = index;
        
        const front = document.createElement('div');
        front.className = 'front';
        front.textContent = '💝';
        
        const back = document.createElement('div');
        back.className = 'back';
        back.textContent = card.symbol;
        
        cardElement.appendChild(front);
        cardElement.appendChild(back);
        
        if (card.flipped) {
            cardElement.classList.add('flipped');
        }
        
        if (card.matched) {
            cardElement.classList.add('matched');
        }
        
        cardElement.addEventListener('click', () => handleCardClick(index));
        gameBoard.appendChild(cardElement);
    });
}

// Handle card click
function handleCardClick(index) {
    const card = cards[index];
    
    // Ignore if card is already flipped, matched, or two cards are already flipped
    if (card.flipped || card.matched || flippedCards.length >= 2) {
        return;
    }
    
    // Start timer on first move
    if (moves === 0) {
        startTimer();
    }
    
    // Flip card
    card.flipped = true;
    flippedCards.push(index);
    renderBoard();
    
    // Check for match when two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        
        setTimeout(checkMatch, 800);
    }
}

// Check if flipped cards match
function checkMatch() {
    const [index1, index2] = flippedCards;
    const card1 = cards[index1];
    const card2 = cards[index2];
    
    if (card1.symbol === card2.symbol) {
        // Match found
        card1.matched = true;
        card2.matched = true;
        matchedPairs++;
        
        // Check for victory
        if (matchedPairs === symbols.length) {
            setTimeout(showVictory, 500);
        }
    } else {
        // No match, flip cards back
        card1.flipped = false;
        card2.flipped = false;
    }
    
    flippedCards = [];
    renderBoard();
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('timer').textContent = 
            `${minutes}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

// Show victory modal
function showVictory() {
    clearInterval(timerInterval);
    
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeString = `${minutes}:${secs.toString().padStart(2, '0')}`;
    
    document.getElementById('finalMoves').textContent = moves;
    document.getElementById('finalTime').textContent = timeString;
    document.getElementById('victoryModal').classList.add('show');
}

// Event listeners
document.getElementById('restartBtn').addEventListener('click', initGame);
document.getElementById('playAgainBtn').addEventListener('click', initGame);

// Start game on page load
initGame();
