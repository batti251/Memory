import { gameSetup, players, cards, winner } from '../scripts/game';


export function loadPage() {
    return `
    <div class="page page--${gameSetup[0]}">
    <header id="header"></header>
    <main id="board"></main>
    <dialog id="game-over"></dialog>
    </div>
    `
}


export function loadHeader() {
    return `
    <div class="game__header game__header--${gameSetup[0]}">
        <div class="player__count player__count--${gameSetup[0]}">
        <div class="player__count player__count--${players.player1.color}">
            <img id="player-${players.player1.color}" src="/decks/theme_${gameSetup[0]}/player_${players.player1.color}_${gameSetup[0]}.svg" alt="players_icon">
            <span class="player__color">${players.player1.color}</span>    
            <span id="count_player-${players.player1.color}" class="player__counter player__counter--${players.player1.color}">0</span>
            </div>
            
        <div class="player__count count player__count--${players.player2.color}">
            <img id="player-${players.player2.color}" src="/decks/theme_${gameSetup[0]}/player_${players.player2.color}_${gameSetup[0]}.svg" alt="players_icon">
            <span class="player__color">${players.player2.color}</span>    
            <span id="count_player-${players.player2.color}" class="player__counter player__counter--${players.player2.color}">0</span>
            </div>
            
        </div>
        <div class="player__turn player__turn--${gameSetup[0]}">
            Current player: 
            <img id="current-player" data-turn="${players.player1.color}" src="/decks/theme_${gameSetup[0]}/player_${players.player1.color}_${gameSetup[0]}.svg" alt="current_players_icon">
        </div>
        <button id="btn-exit" class="btn btn__exit btn__exit btn__exit--${gameSetup[0]}"><span class="btn__exit--text">Exit game</span></button>
        </div>
        `
}


export function loadBoard() {
    return `
        <table class="board board__${gameSetup[2]} board__${gameSetup[0]}">
            <tbody>
                <tr class="board__row board__row--${gameSetup[2]}">
                ${cards.map(c => {
        return `
                     <td class="card card__${gameSetup[0]}">
                        <figure>
                            <img data-value="${c}" data-select="false" class="card__cover" src="/decks/theme_${gameSetup[0]}/cover_${gameSetup[0]}.svg">
                        </figure>
                    </td>`
    }).join("")
        }
                </tr>
            </tbody>
        </table>
    `
}

export function openExitDialog() {
    return `
    <article class="popup__wrap popup__wrap--${gameSetup[0]}">
        <span class="popup__text popup__text--${gameSetup[0]}">Are you sure you want to quit the game?</span>  
        <div class="popup-btn-group">
         <button id="btn-resume" class="btn btn__resume btn__resume--${gameSetup[0]}"></button>
         <button id="btn-quit" class="btn btn__end btn__end--${gameSetup[0]}"></span></button>
        </div>
        </article>
    `
}


export function loadGameMenu() {
    return `
    <article class="dialog dialog__${gameSetup[0]}">
        <span class="draw draw--${gameSetup[0]}">DRAW</span>  
        <div class="btn-group">
         <button id="btn-restart" class="btn btn__restart btn__restart--${gameSetup[0]}"><span class="btn__exit--text"></span></button>
         <button id="btn-exit-draw" class="btn btn__exit btn__exit btn__exit--${gameSetup[0]}"><span class="btn__exit--text">Exit</span></button>
        </div>
        </article>
    `
}


export function loadEndResult() {
    return `
    <article class="dialog__result dialog__result--${gameSetup[0]}">
        <h2 class="dialog__game-over dialog__game-over--${gameSetup[0]}">Game over</h2>
        <span class="subtext subtext--${gameSetup[0]}">Final Score</span>
                <div class="player__count player__count--${gameSetup[0]}">
        <div class="player__count player__count--${players.player1.color}">
            <img id="player-${players.player1.color}" src="/decks/theme_${gameSetup[0]}/player_${players.player1.color}_${gameSetup[0]}.svg" alt="players_icon">
            <span class="player__color player__color--${gameSetup[0]}">${players.player1.color.charAt(0).toUpperCase() + players.player1.color.slice(1)}</span>    
            <b id="count_player-${players.player1.color}" class="player__counter player__counter--${players.player1.color} player__counter--${gameSetup[0]}">${players.player1.count}</b>
            </div>
            
        <div class="player__count count player__count--${players.player2.color}">
            <img id="player-${players.player2.color}" src="/decks/theme_${gameSetup[0]}/player_${players.player2.color}_${gameSetup[0]}.svg" alt="players_icon">
            <span class="player__color player__color--${gameSetup[0]}">${players.player2.color.charAt(0).toUpperCase() + players.player2.color.slice(1)}</span>    
            <b id="count_player-${players.player2.color}" class="player__counter player__counter--${players.player2.color} player__counter--${gameSetup[0]}">${players.player2.count}</b>
            </div>
            
        </div>
    </article>
    `
}

export function loadWinningScreen() {
    return `
    <article class="dialog__result dialog__result--${gameSetup[0]}--win">
        <img class="confetti confetti--${gameSetup[0]}" src="/decks/theme_code/confetti.svg">
        <span class="subtext subtext--${gameSetup[0]} ">The winner is</span>
        <b class="player__counter winner winner__${winner} player__counter--${gameSetup[0]}">${winner.toUpperCase()} PLAYER</b>
        <img class="winner__img" src="/decks/theme_${gameSetup[0]}/img_win_${winner}.svg">

        <a href="settings.html" class="btn btn__exit btn__exit--${gameSetup[0]} btn__home btn__home--${gameSetup[0]}"><span class="btn__exit--text"></span></a>
    </article>
    `
}
