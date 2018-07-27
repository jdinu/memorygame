/*
 * Create a list that holds all of your cards
 */
var cards = ['fa-diamond','fa-diamond',
'fa-paper-plane-o','fa-paper-plane-o',
'fa-anchor','fa-anchor',
'fa-bolt','fa-bolt',
'fa-cube','fa-cube',
'fa-leaf','fa-leaf',
'fa-bicycle','fa-bicycle',
'fa-bomb','fa-bomb'];

//Dynamically generate the html for the card
function generateCard(card)
{
   return  `<li class="card"><i class="fa ${card}"></i></li>`;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
// Jaya's code starts here

// Initializing Global Varaiables
const deck = document.querySelector('.deck');
let toggledCards=[];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const TOTAL_PAIRS = 8;

initGame();
// Event Listeners
deck.addEventListener('click',event => {
    const clickTarget = event.target;
    if (isClickValid(clickTarget)){
        startClock(); 
        displayTime();  
        toggleCard(clickTarget); 
        addToggleCard(clickTarget);
    if (toggledCards.length === 2)
    {
     checkForMatch(clickTarget);     
     checkScore();
     addMove();     
    }
    }

});
document.querySelector('.modal_replay').addEventListener('click', replayGame);
document.querySelector('.restart').addEventListener('click',resetGame);  

// Functions Start here
//This function will initiate the game,shuffle the cards
function initGame()
{
  var deck = document.querySelector('.deck');
  var cardHTML = shuffle(cards).map(function(card){
      return generateCard(card);
  });
 deck.innerHTML = cardHTML.join('');
 resetMoves();
 resetClockAndTime(); 
 resetStars();
}
function resetGame()
{
    initGame();
}
function replayGame()
{
    resetGame();
    toggleModal();
}
function resetClockAndTime()
{
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}
function resetMoves()
{
    moves = 0;
    document.querySelector('.moves').innerHTML = moves; 
}
function resetStars()
{
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList)
    {
        star.style.display = 'inline';
    }
}

function shuffleDeck()
{
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCrads = shuffle(cardsToShuffle);
    console.log('Shuffled Cards',shuffledCrads);
    for (card of shuffledCrads)
        {
        deck.appendChild(card);
        }
}

function addMove()
{
 moves++;
 const movesText = document.querySelector('.moves');
 movesText.innerHTML = moves;
}
function checkScore(){
    if (moves === 16 || moves === 24)
    {
       //console.log('calling hidestar fn');
       hideStar();  
    }  
}
function hideStar(){
    const starList = document.querySelectorAll('.stars li');
    for(star of starList)
    {
     console.log('Inside for loop');
     star.style.display ='none';     
    }
}

function startClock()
{
 clockId = setInterval(() =>{ time++;},1000); 
 console.log(time);
}

function stopClock()
{
    clearInterval(clockId);
}

function displayTime()
{
const clock = document.querySelector('.clock');
const minutes = Math.floor(time/60);
const seconds = time % 60;
    if (seconds < 10)
    {
    clock.innerHTML =`${minutes}:0 ${seconds}` ;    
    }
    else
    {
    clock.innerHTML =`${minutes}:${seconds}` ;
    }
   // console.log(clock.innerHTML);
}


/*function toggleModal()
{
    console.log("Inside toggleModal fn");
    const modal = document.querySelector('.model_background');
    modal.classList.toggle('hide');    
}*/

function toggleModal()
{
    console.log("Inside toggleModal fn");
    var modalDlg = document.getElementById("modal");
    // If "modal_background hide" exist, overwrite it with "modal_background"
    if (modalDlg.className === "modal_background hide") {
        modalDlg.className = "modal_background";
    } else {
        modalDlg.className = "modal_background hide";
    }
}
/*function writeModalStats()
{
    const timeStat = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal_moves');
    const starsStat = document.querySelector('.modal_stars');
    const stars = getStars();
    timeStat.innerHTML = 'Time = ${clockTime}';
    movesStat.innerHTML = 'Moves = ${moves}';
    starsStat.innerHTML ='Stars = ${stars}';    
}*/
function writeModalStats()
{
    const timeStat = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal_moves');
    const starsStat = document.querySelector('.modal_stars');
    const stars = getStars();
    timeStat.innerHTML = 'Time =  '+ clockTime;
    movesStat.innerHTML = 'Moves ='+ moves;
    starsStat.innerHTML ='Stars = '+ stars;  
  
   
}

function getStars(){
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars){
        if (star.style.display !== 'none'){
            starCount++;
        }
    }
    console.log(starCount);
    return starCount;
}
function toggleCard(card)
{
 card.classList.toggle('open');
 card.classList.toggle('show');
}

function addToggleCard(clickTarget){
    toggledCards.push(clickTarget);
    console.log(toggledCards);
}

function isClickValid(clickTarget)
{
    return(
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)
    );
}

function checkForMatch(){
    if (toggledCards[0].firstElementChild.className ===
        toggledCards[1].firstElementChild.className)
    {
        matched++;
        console.log("Matched value is"+ matched);
     toggledCards[0].classList.toggle('match');
     toggledCards[1].classList.toggle('match');
     toggledCards=[]; 
     //match value is not correct 
           
    }
    else
    {
        setTimeout(() => {   
        toggleCard(toggledCards[0]);
        toggleCard(toggledCards[1]);
        toggledCards=[];
        }, 1000);
    }
   console.log ("check for match condition is completed");
    if (matched === TOTAL_PAIRS) 
    {
    console.log("Matched value is"+ matched);
    console.log("constant value of total pairs is"+ TOTAL_PAIRS);
     gameOver();
    }      
}

function gameOver()
{
    console.log('inside gameOver');
    stopClock();
    writeModalStats();
    toggleModal();
   
    
}