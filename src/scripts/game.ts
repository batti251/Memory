import { loadGameMenu, loadWinningScreen, loadEndResult, openExitDialog, showResultScreen } from '../templates/template';


initGame();
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


/**
 * starts game initiation
 * it stores random card-values and shuffles them
 */
function initGame() {
    addEventListener('load', () => {
        if (gameSetup) {
            loadCards();
        }
        shuffle()
    })
}

/**
 * generates the card-deck, that is used for the game
 */
function loadCards() {
    const gameBoardSize: number = parseInt(gameSetup[2])
    cards = []
    const gamePairs: number = gameBoardSize / 2
    let x = 0
    while (x < gamePairs) {
        randomArray()
        x++
    }
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

/**
 * selects, who starts the game, according to the preselect-setting
 */
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
        let clickedTarget = target.classList;
        if (clickedTarget.contains("card__cover") && target.dataset.select == "false") {
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
        target.src = `/decks/theme_${gameSetup[0]}/cards/card_${target.dataset.value}.svg`
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
}

/**
 * switches to the next player
 */
function nextPlayer() {
    let currentPlayer = document.getElementById('current-player') as HTMLImageElement
    currentPlayer?.dataset.turn == "orange" ? currentPlayer.dataset.turn = "blue" : currentPlayer.dataset.turn = "orange";
    currentPlayer?.dataset.turn == "orange" ? currentPlayer.src = `/decks/theme_${gameSetup[0]}/player_orange_${gameSetup[0]}.svg` : currentPlayer.src = `/decks/theme_${gameSetup[0]}/player_blue_${gameSetup[0]}.svg`;
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
        t.src = `/decks/theme_${gameSetup[0]}/cover_${gameSetup[0]}.svg`
    });
    nextPlayer();
}

/**
 * Handler to check, if the game has ended
 * It ends, as soon as all matched cards are flipped
 * It changes the dialogs DOM accordingly
 */
export function gameEnd() {
    const dialog = document.getElementById('game-over') as HTMLDialogElement;
    const leftoverCards = document.querySelectorAll('[data-select="false"]')
    if (leftoverCards.length == 0) {
        if (returnWinner()) {
            showResultScreen(dialog)
            setTimeout(() => {
                showWinnerScreen(dialog)
            }, 1500);
        }
    }
}

/**
 * Switches the dialog-elements content
 * @param dialog - the according dialog-Element
 */
function showWinnerScreen(dialog: HTMLDialogElement) {
    const result = dialog.querySelector('.dialog__result') as HTMLElement;
    const winning = document.getElementById('result-screen') as HTMLElement;
    if (result && winning) {
        result.style.display = 'none';
        winning.style.display = 'block';
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
 * Activates Eventlisteners ingame for button-functions
 */
export function exitGameBtn() {
    const btnHeader = document.getElementById('btn-exit') as HTMLButtonElement;
    const btnDraw = document.getElementById('btn-exit-draw') as HTMLButtonElement;
    const btnRestart = document.getElementById('btn-restart') as HTMLButtonElement;
    const dialog = document.getElementById('game-over') as HTMLDialogElement;
    if (btnHeader) {
        loadExitMenuListener(dialog, btnHeader);
    }
    if (btnDraw) {
        returnToSettings(btnDraw);
    }
    if (btnRestart) {
        startGame(btnRestart);
    }
}

/**
 * Adds Eventlisteners to open the ingame menu
 * It's rather opened by esc- , or click-event
 * @param dialog - the according dialog-element
 * @param btn - the id-button:(#btn-id) 
 */
function loadExitMenuListener(dialog: HTMLDialogElement, btn: HTMLButtonElement) {
    document.addEventListener('keydown', (e) => {
        if (e.key == "Escape" && !dialog.open) {
            e.preventDefault();
            openDialog(dialog)
        } else if (e.key == "Escape" && dialog.open) {
            closeDialog(dialog)
        }
    })

    btn.addEventListener('click', () => {
        openDialog(dialog);
    })
}


/**
 * Opens the dialog-element and adds relevant button-Eventlisteners
 * @param dialog - the according dialog-element
 */
function openDialog(dialog: HTMLDialogElement) {
    showDialog(dialog);
    loadPopupBtnListner(dialog);
}

/**
 * Closes the dialog-element
 * @param dialog - the according dialog-element
 */
function closeDialog(dialog: HTMLDialogElement) {
    dialog.classList.remove('popup');
    dialog.close();
}

/**
 * eventlistener for starting a new game
 * @param btn - the clicked button
 */
function startGame(btn: HTMLButtonElement) {
    btn.addEventListener('click', () => {
        window.open('game.html', '_self');
    })
}


/**
 * shows the dialog-element
 * adds popup-class for modal-design
 */
function showDialog(dialog: HTMLDialogElement) {
    dialog.classList.add('popup');
    dialog.innerHTML = openExitDialog();
    dialog.showModal();
}

/**
 * Activates eventlisteners for popup-buttons 
 */
function loadPopupBtnListner(dialog: HTMLDialogElement) {
    const btnResume = document.getElementById('btn-resume');
    const btnQuit = document.getElementById('btn-quit') as HTMLButtonElement;
    if (btnResume) {
        btnResume.addEventListener('click', () => {
            closeDialog(dialog);
        })
    }
    if (btnQuit) {
        returnToSettings(btnQuit);
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
 * deletes the sessionstorage 'memory'
 */
function deleteSessionStorage() {
    sessionStorage.removeItem('memory')
}