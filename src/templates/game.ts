
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
    <div class="board board__${gameSetup[0]}">
        <table>
            <thead></thead>
            <tbody></tbody>
        </table>
    </div>
    `
}