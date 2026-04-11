
init();
uncoverCard();

const gameSetupStorage: string | any = sessionStorage.getItem('memory');
const gameSetup: string[] = JSON.parse(gameSetupStorage);
const cardDeck: number = 18
let cards: number[] = [];
let targets: HTMLImageElement[] = []


const gameBoardSize: number = parseInt(gameSetup[2])
function init() {
    addEventListener('load', (event) => {
        if (gameSetup) {
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
        <div class="player__count player__count--blue">
            <img id="player-blue" src="/src/public/decks/theme_${gameSetup[0]}/player_blue_${gameSetup[0]}.svg" alt="players_icon">
            <span class="player__color">Blue</span>    
            <span class="player__counter player__counter--blue">0</span>
            </div>
            
        <div class="player__count count player__count--orange">
            <img id="player-orange" src="/src/public/decks/theme_${gameSetup[0]}/player_orange_${gameSetup[0]}.svg" alt="players_icon">
            <span class="player__color">Orange</span>    
            <span class="player__counter player__counter--orange">1</span>
            </div>
            
        </div>
        <div class="player__turn player__turn--${gameSetup[0]}">
            Current player: 
            <img src="/src/public/decks/theme_${gameSetup[0]}/player_blue_${gameSetup[0]}.svg" alt="current_players_icon">
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

/**
 * listener to clicked elements
 * fires only, when card__cover-elements are clicked
 * clicking the same element again, will have no further effect
 */
function uncoverCard() {
    addEventListener('click', (e) => {
        let target = e.target as HTMLImageElement
        let clickedTarget = [...target.classList];
        
        if (clickedTarget.includes("card__cover") && !clickedTarget.includes("flip")) {
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
function compareCards(targets:HTMLImageElement[]) {
    setTimeout(() => {
            targets[0].dataset.value == targets[1].dataset.value ? foundPair(targets) : coverCards(targets);
    }, 1000);
}


/**
 * Hookup Function from ${@link compareCards}
 * It marks the elements as selected
 * @param targets - array with clicked elements
 */
function foundPair(targets:HTMLImageElement[]) {
    targets.forEach(t => {
        t.dataset.select = "true";
        t.classList.remove('flip');
    });
}

/**
 * Hookup Function from ${@link compareCards}
 * It re-cover the selected cards
 * @param targets - array with clicked elements
 */
function coverCards(targets:HTMLImageElement[]) {
    targets.forEach(t => {
        t.classList.remove('flip');
        t.src = `/src/public/decks/theme_${gameSetup[0]}/cover_${gameSetup[0]}.svg`
    });
}