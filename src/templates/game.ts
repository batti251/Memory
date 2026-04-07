
init();


function init() {
    addEventListener('load', (event) => {
    const gameSetup = sessionStorage.getItem('memory')
        console.log(gameSetup);
        
    })
    
}


export function loadHeader() {
    return `
        <div>
            <img id="player_one" src="" alt="players_icon">
            <img id="player_two" src="" alt="players_icon">
        </div>
        <div>Current player: 
            <img src="" alt="current_players_icon">
        </div>
        <button>Exit game</button>
    `
}


export function loadBoard() {
    return `
        <table>
            <thead></thead>
            <tbody></tbody>
        </table>
    `
}