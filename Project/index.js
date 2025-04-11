const keyboard = document.getElementById("keyboard");
const userInput = document.getElementById("userInput");
const newGameContainer = document.getElementById("newGame");
const newGameButton = document.getElementById("newGameButton");
const hangmanImg = document.getElementById("hangmanImg");
const resultText = document.getElementById("resultText");

let correctCount = 0;
let incorrectCount = 0;
let chosenWord = "";

// reveal win/lose banner + new game
function endGame() {
  document.querySelectorAll(".letters").forEach(function(button) {
    button.disabled = true;
  });
  newGameContainer.classList.remove("hide");
  newGameButton.classList.remove("hide");
  resultText.classList.remove("hide");
}

// update hangman
function hang() {
  hangmanImg.src = incorrectCount + ".png";
}

function resetGame() {
  correctCount = 0;
  incorrectCount = 0;
  userInput.innerHTML = "";
  keyboard.classList.add("hide");
  newGameContainer.classList.add("hide");
  newGameButton.classList.add("hide");
  resultText.classList.add("hide");
  keyboard.innerHTML = "";
  resultText.innerHTML = "";
  hangmanImg.src = "0.png";
}

function game() {
  resetGame();

  fetch("words.json") // fetch word from JSON
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var wordList = data.words;
      chosenWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
      console.log("Word is: ", chosenWord)
      
      // make word into dashes
      let displayWord = "";
      for (let k = 0; k < chosenWord.length; k++) {
        displayWord += "<span class='dashes'>_</span>";
      }
      userInput.innerHTML = displayWord;
      keyboard.classList.remove("hide");
      
      // create "keyboard"
      for (let i = 65; i < 91; i++) {
        let button = document.createElement("button");
        button.classList.add("letters");
        button.innerText = String.fromCharCode(i);
        
        keyboard.appendChild(button); // add letter to "keyboard"
        
        button.addEventListener("click", function() {
          let letterGuess = this.innerText;
          let charArray = chosenWord.split(""); // split the word into characters
          let blankSpace = document.getElementsByClassName("dashes");
          
          // verify and show guessed letter
          if (charArray.includes(letterGuess)) {
            for (let j = 0; j < charArray.length; j++) {
              if (charArray[j] === letterGuess) {
                blankSpace[j].innerText = letterGuess;
                correctCount++;
              }
            }
            
            // check win condition
            if (correctCount === charArray.length) {
              resultText.innerHTML = "<h2 class='win'>You Win!</h2><p>The word was <span>" + chosenWord + "</span>.</p>";
              endGame();
            }
          } else {
            incorrectCount++;
            hang(); // incorrect guess --> update hangman
            
            // check lose condition
            if (incorrectCount > charArray.length) {
              resultText.innerHTML = "<h2 class='lose'>You Lose!</h2><p>The word was <span>" + chosenWord + "</span>.</p>";
              endGame()
            }
          }
          
          // disable guessed letter
          this.disabled = true;
        });
      }
  });
}

newGameButton.addEventListener("click", game);
window.onload = game(); 