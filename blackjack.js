// Initial variables to store the sum of dealer's and player's cards, and their Ace counts.
let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;

// Variables for the dealer's hidden card and the deck of cards.
let hidden;
let deck;

// Retrieve the player's balance from local storage and initialize the bet amount.
let balance = parseInt(localStorage.getItem("balance"));
let betAmount = 0;

// Flags to control the game flow.
let canHit = true; // Can the player draw another card?
let gameInSession = false; // Is a game currently in progress?

// Function to start a new game. It checks if a game is already in session and sets up a new game.
function start() {
	if (gameInSession) return;
	playSound();
	buildDeck();
	shuffleDeck();
	startGame();
	gameInSession = true;
}
// When the window loads, display the player's balance.
window.onload = function () {
	document.getElementById("balance").textContent = balance;
};
// Function to create a deck of cards.
function buildDeck() {
	let values = [
		"A",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"J",
		"Q",
		"K",
	];
	let types = ["C", "D", "H", "S"];
	deck = [];

	for (let i = 0; i < types.length; i++) {
		for (let j = 0; j < values.length; j++) {
			deck.push(values[j] + "-" + types[i]);
		}
	}
}
// Function to shuffle the deck of cards.
function shuffleDeck() {
	for (let i = 0; i < deck.length; i++) {
		let j = Math.floor(Math.random() * deck.length);
		let temp = deck[i];
		deck[i] = deck[j];
		deck[j] = temp;
	}
	console.log(deck);
}
// Function to start the actual game, dealing cards to the dealer and player.
function startGame() {
	hidden = deck.pop();
	dealerSum += getValue(hidden);
	dealerAceCount += checkAce(hidden);

	while (dealerSum < 17) {
		let cardImg = document.createElement("img");
		let card = deck.pop();
		cardImg.src = "./cards/" + card + ".png";
		dealerSum += getValue(card);
		dealerAceCount += checkAce(card);
		document.getElementById("dealer-cards").append(cardImg);
	}
	console.log(dealerSum);

	for (let i = 0; i < 2; i++) {
		let cardImg = document.createElement("img");
		let card = deck.pop();
		cardImg.src = "./cards/" + card + ".png";
		yourSum += getValue(card);
		yourAceCount += checkAce(card);
		document.getElementById("your-cards").append(cardImg);
	}

	console.log(yourSum);
}
// Function for the player to 'hit' (draw a card).
function hit() {
	if (!canHit || !gameInSession) {
		return;
	}
	playSound();
	let cardImg = document.createElement("img");
	let card = deck.pop();
	cardImg.src = "./cards/" + card + ".png";
	yourSum += getValue(card);
	yourAceCount += checkAce(card);
	document.getElementById("your-cards").append(cardImg);

	if (reduceAce(yourSum, yourAceCount) > 21) {
		canHit = false;
	}
}
// Function to restart the game.
function restart() {
	if (!gameInSession) return;
	playSound();

	dealerSum = 0;
	yourSum = 0;
	dealerAceCount = 0;
	yourAceCount = 0;
	canHit = true;

	document.getElementById("dealer-sum").textContent = "";
	document.getElementById("your-sum").textContent = "";
	document.getElementById("results").textContent = "";

	const dealerCards = document.getElementById("dealer-cards");
	document.getElementById("your-cards").innerHTML = "";

	dealerCards.innerHTML = "";
	const hiddenImg = document.createElement("img");
	hiddenImg.setAttribute("id", "hidden");
	hiddenImg.src = "./cards/BACK.png";

	dealerCards.append(hiddenImg);

	updateDisplay();
	gameInSession = false;
}
// Function to exit the game and redirect to another page.
function exit() {
	window.location.href = "https://www.yourhomepage.com";
}
// Function for the player to stop drawing cards.
function stay() {
	if (!gameInSession) return;
	playSound();
	dealerSum = reduceAce(dealerSum, dealerAceCount);
	yourSum = reduceAce(yourSum, yourAceCount);

	canHit = false;
	document.getElementById("hidden").src = "./cards/" + hidden + ".png";

	let message = "";
	if (yourSum > 21) {
		betAmount = 0;
		message = "You Lose!";
	} else if (dealerSum > 21) {
		balance += betAmount * 2;
		betAmount = 0;
		message = "You win!";
	} else if (yourSum == dealerSum) {
		balance += betAmount;
		betAmount = 0;
		message = "Tie!";
	} else if (yourSum > dealerSum) {
		balance += betAmount * 2;
		betAmount = 0;
		message = "You Win!";
	} else if (yourSum < dealerSum) {
		betAmount = 0;
		message = "You Lose!";
	}

	document.getElementById("dealer-sum").innerText = dealerSum;
	document.getElementById("your-sum").innerText = yourSum;
	document.getElementById("results").innerText = message;

	updateDisplay();
	localStorage.setItem("balance", balance.toString());
}
// Utility function to get the value of a card.
function getValue(card) {
	let data = card.split("-");
	let value = data[0];

	if (isNaN(value)) {
		if (value == "A") {
			return 11;
		}
		return 10;
	}
	return parseInt(value);
}
// Utility function to check if a card is an Ace.
function checkAce(card) {
	if (card[0] == "A") {
		return 1;
	}
	return 0;
}
// Function to adjust the player's total sum considering the dual value of Aces.
function reduceAce(playerSum, playerAceCount) {
	while (playerSum > 21 && playerAceCount > 0) {
		playerSum -= 10;
		playerAceCount -= 1;
	}
	return playerSum;
}
// Function to place a bet.
function placeBet(amount) {
	if (balance >= amount) {
		balance -= amount;
		betAmount += amount;
		updateDisplay();
	} else {
		alert("Insufficient balance!");
	}
}

// Function to update the display with the current balance and bet amount.
function updateDisplay() {
	document.getElementById("balance").textContent = balance;
	document.getElementById("betAmount").textContent = betAmount;
}
// Function to play a sound on-click.
function playSound() {
	var audio = document.getElementById("sound");
	audio.play();
}
// Event listeners for the game buttons (hit, stay, restart, start, double).
const hitButton = document.getElementById("hit");
const stayButton = document.getElementById("stay");
const restartButton = document.getElementById("restart");
const startButton = document.getElementById("start");
const doublebutton = document.getElementById("double");

hitButton.addEventListener("click", hit);
stayButton.addEventListener("click", stay);
restartButton.addEventListener("click", restart);
startButton.addEventListener("click", start);
doublebutton.addEventListener("click", double);
// Function for the 'double' action in the game.
function double() {
	if (!gameInSession) return;
	if (canHit && betAmount * 2 <= balance) {
		balance -= betAmount;

		betAmount *= 2;
		updateDisplay();

		let cardImg = document.createElement("img");
		let card = deck.pop();
		cardImg.src = "./cards/" + card + ".png";
		yourSum += getValue(card);
		yourAceCount += checkAce(card);
		document.getElementById("your-cards").append(cardImg);

		canHit = false;

		playDealer();
	}
}
