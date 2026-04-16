import { loadGameMenu, loadWinningScreen, loadEndResult, openExitDialog } from '../templates/template';
import { gameSettingsPicked } from '../main';


init();
uncoverCard();

const gameSetupStorage: string | any = sessionStorage.getItem('memory');
export const gameSetup: string[] = JSON.parse(gameSetupStorage);
export let cards: number[] = [];
export let winner: string = "";
const cardDeck: number = 18
let targets: HTMLImageElement[] = []
let globalCount: {
    blue: number,
    orange: number,
    [key: string]: number
} = {
    blue: 0,
    orange: 0
}


export let players: {
    player1: {
        color: string,
        count: number
    },
    player2: {
        color: string,
        count: number
    }
} = {
    player1: {
        color: "",
        count: 0
    },
    player2: {
        color: "",
        count: 0
    }
}



function init() {
    addEventListener('load', (event) => {
        if (gameSetup) {
            const gameBoardSize: number = parseInt(gameSetup[2])
            cards = []
            const gamePairs: number = gameBoardSize / 2
            let x = 0
            while (x < gamePairs) {
                randomArray()
                x++
            }
        }
        shuffle()
        console.log(cards);

    })
}

/**
 * adds random numbers, from ${@link randomNumberGen}, to cards-array
 */
function randomArray() {
    let number = randomNumberGen();
    let isNumberTaken = cards.includes(number);
    isNumberTaken ? randomArray() : cards.push(number, number);
}

/**
 * random number generator, according to the defined cardDeck
 * 
 * @returns - random number
 */
function randomNumberGen() {
    let randomNumber: number = Math.floor(Math.random() * cardDeck);
    return randomNumber;
}

/**
 * shuffles the generated cards-Array randomly, from ${@link randomArray}
 */
function shuffle() {
    let i = cards.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = cards[j];
        cards[j] = cards[i];
        cards[i] = temp;
    }
}


export function playersFirstTurn() {
    if (gameSetup) {
        players.player1.color = gameSetup[1]
        players.player1.color == "blue" ? players.player2.color = "orange" : players.player2.color = "blue"
    }
}


/**
 * listener to clicked elements
 * fires only, when card__cover-elements are clicked
 * clicking the same element again, will have no further effect
 */
function uncoverCard() {
    addEventListener('click', (e) => {
        let target = e.target as HTMLImageElement
        let clickedTarget = [...target.classList];
        if (clickedTarget.includes("card__cover") && target.dataset.select == "false") {
            targets.length == 2 ? targets = [] : "";
            flipCard(target);
        }
    })
}

/**
 * flips the covered Card and shows the current cards image
 * @param target - the clicked img-element
 */
function flipCard(target: HTMLImageElement) {
    target.classList.add('flip');
    revealCard(target)
    targets.push(target);
    targets.length == 2 ? compareCards(targets) : "";
}

/**
 * adds the img-source to the targets element
 * @param target - the clicked img-element
 */
function revealCard(target: HTMLImageElement) {
    setTimeout(() => {
        target.src = `/src/public/decks/theme_${gameSetup[0]}/cards/card_${target.dataset.value}.svg`
    }, 500);
}


/**
 * Compares elements-value, when targets array is filled by 2 items during ${@link flipCard}
 * Depending on the comparison a next function is called: 
 * true:  calls ${@link foundPair}
 * false: calls ${@link coverCards}
 * @param targets - array with clicked elements
 */
function compareCards(targets: HTMLImageElement[]) {
    setTimeout(() => {
        targets[0].dataset.value == targets[1].dataset.value ? foundPair(targets) : coverCards(targets);
    }, 1000);
    nextPlayer() //LÖSCHEN
}

/**
 * switches to the next player
 */
function nextPlayer() {
    let currentPlayer = document.getElementById('current-player') as HTMLImageElement
    currentPlayer?.dataset.turn == "orange" ? currentPlayer.dataset.turn = "blue" : currentPlayer.dataset.turn = "orange";
    currentPlayer?.dataset.turn == "orange" ? currentPlayer.src = `/src/public/decks/theme_${gameSetup[0]}/player_orange_${gameSetup[0]}.svg` : currentPlayer.src = `/src/public/decks/theme_${gameSetup[0]}/player_blue_${gameSetup[0]}.svg`;
}

/**
 * increase Players counter by 1
 * Updates the DOM accordingly
 */
function increasePlayerCount() {
    let currentPlayer = document.getElementById('current-player');
    let counterRef = document.getElementById(`count_player-${currentPlayer?.dataset.turn}`) as HTMLElement;
    Object.values(players).forEach(player => {
        if (player.color == currentPlayer?.dataset.turn) {
            player.count++
            counterRef.innerHTML = player.count.toString();
            globalCount[player.color] = player.count
        }
    })
}

/**
 * Hookup Function from ${@link compareCards}
 * It marks the elements as selected
 * @param targets - array with clicked elements
 */
function foundPair(targets: HTMLImageElement[]) {
    increasePlayerCount()
    targets.forEach(t => {
        t.dataset.select = "true";
        t.classList.remove('flip');
    });
    gameEnd();
}

/**
 * Hookup Function from ${@link compareCards}
 * It re-cover the selected cards
 * @param targets - array with clicked elements
 */
function coverCards(targets: HTMLImageElement[]) {
    targets.forEach(t => {
        t.classList.remove('flip');
        t.src = `/src/public/decks/theme_${gameSetup[0]}/cover_${gameSetup[0]}.svg`
    });
    /* nextPlayer(); */
}


/**
 * Handler to check, if the game has ended
 * It ends, as soon as all matched cards are flipped 
 */
function gameEnd() {
    let dialog = document.getElementById('game-over') as HTMLElement;
    const leftoverCards = document.querySelectorAll('[data-select="false"]')
    if (leftoverCards.length == 0) {
        if (returnWinner()) {
            dialog.classList.add('dialog');
            dialog.innerHTML = loadEndResult()
            setTimeout(() => {
                dialog.innerHTML = loadWinningScreen()
            }, 1500);
        }
    }
}

/**
 * Handler to evaluate the result
 * @returns [true: a winner exists ; false: game-draw]
 */
function returnWinner(): boolean {
    if (globalCount.blue > globalCount.orange) {
        winner = "blue"
        return true
    } else if (globalCount.blue < globalCount.orange) {
        winner = "orange";
        return true
    } else {
        restartGame();
        return false
    }
}

/**
 * Handler, to trigger a rematch, when no winner exists from ${@link returnWinner()} 
 */
function restartGame() {
    const dialog = document.getElementById('game-over') as HTMLDialogElement;
    dialog.classList.add('dialog');
    dialog.innerHTML = loadGameMenu();
    exitGameBtn();
}


/**
 * Activates eventlisteners ingame for exit-button & draw-buttons
 */
export function exitGameBtn() {
    const btnHeader = document.getElementById('btn-exit') as HTMLButtonElement;
    const btnDraw = document.getElementById('btn-exit-draw') as HTMLButtonElement;
    const btnRestart = document.getElementById('btn-restart') as HTMLButtonElement;
    if (btnHeader) {
        openDialog(btnHeader);
    }
    if (btnDraw) {
        returnToSettings(btnDraw);
    }
    if (btnRestart) {
        startGame(btnRestart);
    }
}

/**
 * eventlistener for starting a new game
 * @param btn - the clicked button
 */
function startGame(btn:HTMLButtonElement) {
    btn.addEventListener('click', () => {
            window.open('game.html', '_self')
        })
}

/**
 * opens the dialog-modal and load relevant button-eventlisteners
 * @param btn - the clicked button
 */
function openDialog(btn:HTMLButtonElement) {
    btn.addEventListener('click' , () => {
        showDialog();
        loadPopupBtn();
    })
}

/**
 * shows the dialog-element
 * adds popup.class for specific design
 */
function showDialog() {
    const dialog = document.getElementById('game-over') as HTMLDialogElement;
    dialog.classList.add('popup');
    dialog.innerHTML = openExitDialog();
    dialog.showModal();
}

/**
 * Activates eventlisteners for popup-buttons 
 */
function loadPopupBtn() {
    const btnResume = document.getElementById('btn-resume');
    const btnQuit = document.getElementById('btn-quit') as HTMLButtonElement;
    if (btnResume) {
        btnResume.addEventListener('click', () => {
            closeDialog();
        })
    }
    if (btnQuit) {
        returnToSettings(btnQuit)
    }
}

/**
 * Sends the user back to the settings-page
 * Additionally deletes session storage
 * @param btn - button
 */
function returnToSettings(btn: HTMLButtonElement) {
    btn.addEventListener('click', () => {
        window.open('settings.html', '_self');
        deleteSessionStorage();
    })
}


/**
 * CLoses the dialog-element
 */
function closeDialog() {
    const dialog = document.getElementById('game-over') as HTMLDialogElement;
    dialog.classList.remove('popup');
    dialog.close();
}

/**
 * deletes the sessionstorage 'memory'
 */
function deleteSessionStorage() {
    sessionStorage.removeItem('memory')
}