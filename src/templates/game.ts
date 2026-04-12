
init();
uncoverCard();

const gameSetupStorage: string | any = sessionStorage.getItem('memory');
const gameSetup: string[] = JSON.parse(gameSetupStorage);
const cardDeck: number = 18
let cards: number[] = [];
let targets: HTMLImageElement[] = []
let winner:string = "";
let globalCount: {
    blue: number,
    orange: number
} = {
    blue: 0,
    orange: 0
}

let players: {
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


export function loadHeader() {
    return `
    <div class="game__header game__header--${gameSetup[0]}">
        <div class="player__count player__count--${gameSetup[0]}">
        <div class="player__count player__count--${players.player1.color}">
            <img id="player-${players.player1.color}" src="/src/public/decks/theme_${gameSetup[0]}/player_${players.player1.color}_${gameSetup[0]}.svg" alt="players_icon">
            <span class="player__color">${players.player1.color}</span>    
            <span id="count_player-${players.player1.color}" class="player__counter player__counter--${players.player1.color}">0</span>
            </div>
            
        <div class="player__count count player__count--${players.player2.color}">
            <img id="player-${players.player2.color}" src="/src/public/decks/theme_${gameSetup[0]}/player_${players.player2.color}_${gameSetup[0]}.svg" alt="players_icon">
            <span class="player__color">${players.player2.color}</span>    
            <span id="count_player-${players.player2.color}" class="player__counter player__counter--${players.player2.color}">0</span>
            </div>
            
        </div>
        <div class="player__turn player__turn--${gameSetup[0]}">
            Current player: 
            <img id="current-player" data-turn="${players.player1.color}" src="/src/public/decks/theme_${gameSetup[0]}/player_${players.player1.color}_${gameSetup[0]}.svg" alt="current_players_icon">
        </div>
        <button class="btn btn__exit btn__exit btn__exit--${gameSetup[0]}"><span class="btn__exit--text">Exit game</span></button>
        </div>
        `
}


export function loadBoard() {
    return `
        <table class="table table__${gameSetup[2]} table__${gameSetup[0]}">
            <tbody>
                <tr id="table-row" class="table__row table__row--${gameSetup[2]}">
                ${cards.map(c => {
        return `
                     <td class="card card__${gameSetup[0]}">
                        <figure>
                            <img data-value="${c}" data-select="false" class="card__cover" src="/src/public/decks/theme_${gameSetup[0]}/cover_${gameSetup[0]}.svg">
                        </figure>
                    </td>`
    }).join("")
        }
                </tr>
            </tbody>
        </table>
    `
}

export function playersFirstTurn() {
    if (gameSetup) {
        players.player1.color = gameSetup[1]
        players.player1.color == "blue" ? players.player2.color = "orange" : players.player2.color = "blue"

    }


}

export function playersCount() {
    let currentPlayer = document.getElementById(`count_player${gameSetup[1]}`)
    console.log(currentPlayer);


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
        nextPlayer();
    }, 1000);

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
}



function gameEnd() {
    let dialog = document.getElementById('game-over') as HTMLElement;
    const leftoverCards = document.querySelectorAll('[data-select="false"]')
    if (leftoverCards.length == 0) {
        globalCount.blue > globalCount.orange ? winner = "blue" : winner = "orange"
        dialog.classList.add('dialog');
        dialog.innerHTML = loadEndResult()
        setTimeout(() => {
            dialog.innerHTML = loadWinningScreen()
            
        }, 1500);
    }
}

function loadEndResult() {
    return `
    <article class="dialog__${gameSetup[0]}">
        <h2 class="dialog__game-over dialog__game-over--${gameSetup[0]}">Game over</h2>
        <span class="subtext subtext--${gameSetup[0]}">Final Score</span>
                <div class="player__count player__count--${gameSetup[0]}">
        <div class="player__count player__count--${players.player1.color}">
            <img id="player-${players.player1.color}" src="/src/public/decks/theme_${gameSetup[0]}/player_${players.player1.color}_${gameSetup[0]}.svg" alt="players_icon">
            <span class="player__color player__color--${gameSetup[0]}">${players.player1.color.charAt(0).toUpperCase()+ players.player1.color.slice(1)}</span>    
            <b id="count_player-${players.player1.color}" class="player__counter player__counter--${players.player1.color} player__counter--${gameSetup[0]}">${players.player1.count}</b>
            </div>
            
        <div class="player__count count player__count--${players.player2.color}">
            <img id="player-${players.player2.color}" src="/src/public/decks/theme_${gameSetup[0]}/player_${players.player2.color}_${gameSetup[0]}.svg" alt="players_icon">
            <span class="player__color player__color--${gameSetup[0]}">${players.player2.color.charAt(0).toUpperCase()+ players.player2.color.slice(1)}</span>    
            <b id="count_player-${players.player2.color}" class="player__counter player__counter--${players.player2.color} player__counter--${gameSetup[0]}">${players.player2.count}</b>
            </div>
            
        </div>
    </article>
    `
}

export function loadWinningScreen() {
    return `
    <article class="dialog__${gameSetup[0]} dialog__${gameSetup[0]}--win">
        <img class="confetti confetti--${gameSetup[0]}" src="/src/public/decks/theme_code/confetti.svg">
        <span class="subtext subtext--${gameSetup[0]} ">The winner is</span>
        <b class="player__counter winner winner__${winner} winner__${winner}--${gameSetup[0]} player__counter--${gameSetup[0]}">${winner.toUpperCase()} PLAYER</b>
        <img class="winner__img" src="/src/public/decks/theme_${gameSetup[0]}/img_win_${winner}.svg">

        <a href="/src/pages/settings.html" class="btn btn__exit btn__exit--${gameSetup[0]} btn__home btn__home--${gameSetup[0]}"><span class="btn__exit--text"></span></a>
    </article>
    `
}