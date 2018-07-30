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
document.querySelector('.modal_cancel').addEventListener('click',toggleModal);  
document.querySelector('.modal_close').addEventListener('click',closeDialog);

// Functions Start here
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
//This function will initiate the game,shuffle the cards
function initGame()
{
    matched = 0;
    var deck = document.querySelector('.deck');
    var cardHTML = shuffle(cards).map(function(card){
        return generateCard(card);
    });
    deck.innerHTML = cardHTML.join('');
    resetMoves();
    resetClockAndTime(); 
    resetStars();
}
//refresh the game
function resetGame()
{
    initGame();
}
//replay the gane
function replayGame()
{    
    toggleModal();
    initGame();   
}
//close dialog by 'X'
function closeDialog()
{
    toggleModal();
}
//reset the clock
function resetClockAndTime()
{
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}
//reset the moves
function resetMoves()
{
    moves = 0;
    document.querySelector('.moves').innerHTML = moves; 
}
//reset the stars
function resetStars()
{
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList)
    {
        star.style.display = 'inline';
    }
}
//shuffle the deck
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
// add the no: of moves
function addMove()
{
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}
//check score and hide the stars
function checkScore()
{    
   //hide the stars based on moves
    if (moves === 10)
    {
         document.getElementById('star1').style.display = 'none'; 
    }
    else if (moves === 15 )
    {
        document.getElementById('star2').style.display = 'none'; 
    }
    else if (moves === 20)
    {
        document.getElementById('star3').style.display = 'none';  
    }
}
//start the clock
function startClock()
{
    clockId = setInterval(() =>{ time++;},1000); 
    console.log(time);
}
//stop the clock 
function stopClock()
{
    clearInterval(clockId);
}
//display Time
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
}
//toggle the model dialog 
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
//Write the game statitics in to the modal dialog
function writeModalStats()
{
    const timeStat = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal_moves');
    const starsStat = document.querySelector('.modal_stars');
    const stars = getStars();
    timeStat.innerHTML = 'Time =  '+ clockTime;
    movesStat.innerHTML = 'Moves =  '+ moves;
    starsStat.innerHTML ='Stars =   '+ stars;  
   }
// Get the current count of stars
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
//toggle the card to show the picture
function toggleCard(card)
{
 card.classList.toggle('open');
 card.classList.toggle('show');
}
//add the toggled card
function addToggleCard(clickTarget){
    toggledCards.push(clickTarget);
    console.log(toggledCards);
}
//validate whether the click on the cards is valid
function isClickValid(clickTarget)
{
    return(
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)
    );
}
//check whether the toggled cards match
function checkForMatch(){
    if (toggledCards[0].firstElementChild.className ===
        toggledCards[1].firstElementChild.className)
    {
        matched++;
        console.log("Matched value is"+ matched);
     toggledCards[0].classList.toggle('match');
     toggledCards[1].classList.toggle('match');
     toggledCards=[];             
    }
    else
    {
        setTimeout(() => {   
        toggleCard(toggledCards[0]);
        toggleCard(toggledCards[1]);
        toggledCards=[];
        }, 1000);
    }
   //Compare the number of matched cards with the total pairs to end the game");
    if (matched === TOTAL_PAIRS) 
    {
     gameOver();
    }      
}
// game is over - show statistics
function gameOver()
{
    console.log('inside gameOver');
    stopClock();
    writeModalStats();
    toggleModal();
}
