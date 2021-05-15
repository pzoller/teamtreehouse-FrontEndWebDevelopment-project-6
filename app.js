document.addEventListener('DOMContentLoaded', () => {

    const phrases = [
        "Absent Without Leave It To Beaver",
        "Engagement Ring Around The Rosy",
        "Three Scoops Of Ice Cream On A Sugar Cone",
        "Burrito Topped With Sour Cream And Salsa",
        "A Big Pot Of Corned Beef And Cabbage",
        "Automatic Garage Door Opener",
        "Adjustable Shoe Rack",
        "Release The Kraken",
        "Arctic Circle Of Friends",
        "Captain Hook Line And Sinker"
    ];

    //Global variables
    startButton = document.querySelector('.btn__reset');
    const overlay = document.querySelector('#overlay');
    const headLine = document.querySelectorAll(`#overlay > .title`);
    const letterBoard = document.querySelector('#phrase > ul');
    const keyboard = document.querySelector('#qwerty');
    const hearts = document.querySelectorAll(`#scoreboard > ol > li`);
    let livesLeft = 5;
    let lettersLeft = 0;
    let chosenPhrase = [];

    function getRandomPhraseAsArray(arr) {
        const choice = Math.floor(Math.random() * arr.length);
        const chosenPhrase = arr[choice].toUpperCase().split('');
        return chosenPhrase;
    }

    function overlayUpdate(status, message = '') {
        overlay.className = `start ${status}`;
        headLine.textContent = `${message}`;
        //A button has been added to the “lose” and “win” overlays to reset the game
        startButton.textContent = `Restart game`;
        overlay.style.display = `flex`;
    }

    function addPhraseToDisplay() {
        letterBoard.innerHTML = '';
        chosenPhrase = getRandomPhraseAsArray(phrases);
        for (let i = 0; i < chosenPhrase.length; i++) {
            const li = document.createElement('LI');
            if (chosenPhrase[i] == ' ') {
                li.className = `space`;
            } else if (chosenPhrase[i].match(/[a-zA-Z]/i)) {
                li.textContent = chosenPhrase[i];
                li.className = `letter`;
            } else {
                console.log(`Not a letter: ${chosenPhrase[i]}`);
            }
            letterBoard.appendChild(li);
        }
    }

    function checkLetter(buttonIn) {
        letterSent = buttonIn.textContent.toUpperCase();
        const lettersFound = chosenPhrase.filter(x => x == letterSent);
        console.log(`Found ${letterSent} ${lettersFound.length} times.`);

        //No letter can be clicked twice
        buttonIn.className = 'chosen';

        if (lettersFound.length > 0) {//Found letters
            //Clicking a letter present in the phrase adds the “show” class to those letters in the display
            for (let i = 0; i < letterBoard.children.length; i++) {
                let child = letterBoard.children[i];
                if (child.textContent === letterSent) {
                    console.log(`Found element ${child.textContent}`);
                    child.className += ` show`;
                    //TODO (Optional): Transitions have been added to the phrase display
                }
            }
        } else {
            //Clicking a letter not present in the phrase removes a chance from the scoreboard
            livesLeft--;
            hearts[livesLeft].firstElementChild.src = "images/lostHeart.png";
        }

        return lettersFound;
    }

    function checkWin() {
        const phraseLetters = document.querySelectorAll('.letter');
        const chosenLetters = document.querySelectorAll('.show');


        //If all the letters in the phrase are shown, the “win” overlay is shown
        if (phraseLetters.length == chosenLetters.length) {
            overlayUpdate('win', `You won!`);
        }

        //If a player makes 5 wrong guesses, the “lose” overlay is shown
        if (livesLeft <= 0) {
            overlayUpdate(`lose`, `You lost!`);
        }
    }

    function clearKeyboard(){
        const keyboardButtons = document.querySelectorAll('.chosen');
        for (let i = 0; i < keyboardButtons.length; i++) {
            keyboardButtons[i].className = '';
        }
    }

    async function setupGameBoard() {
        console.log(`Phrase is: ${chosenPhrase}`);
        livesLeft = 5;
        lettersLeft = chosenPhrase.filter(p => p != ' ').length;

        clearKeyboard();



        overlay.style.display = 'none';
    }

    startButton.addEventListener('click', (e) => {
        addPhraseToDisplay();
        setupGameBoard();
    });

    //TODO:  Listen for click on keyboard panel
    keyboard.addEventListener('click', (e) => {
        //TODO: Clicking space between letters does nothing
        if (e.target.tagName === 'BUTTON' && e.target.className !== 'chosen') {
            const guess = e.target;
            checkLetter(guess);
            checkWin();
        }

    });
});
