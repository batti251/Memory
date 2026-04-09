
init();

    const gameSetupStorage: string = sessionStorage.getItem('memory');
    const gameSetup:string[] = JSON.parse(gameSetupStorage);
    

function init() {
    addEventListener('load', (event) => {
    })
    
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
                ${Array.from({ length: parseInt(gameSetup[2]) }, (_,i) => 
                    `<td class="card card__${gameSetup[0]}">
                <figure><img class="card__cover" src="/src/public/decks/theme_${gameSetup[0]}/cover_${gameSetup[0]}.svg"></figure></td>`
                    ).join("")
                }
                </tr>
            </tbody>
        </table>
    `
}