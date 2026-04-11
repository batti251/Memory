import './styles/main.scss';
import { loadHeader } from './templates/game';
import { loadBoard } from './templates/game';

let gameSettings: string[] = [];
let gameSettingsPicked: string[] = [];

checkGameRequirements()

/**
 * Initializes Game preload. 
 * Creates gameSetting-Array according to unique inputField-names
 */
function checkGameRequirements() {
  const btn = document.getElementById('btn-start')
  btn?.addEventListener('click', () => {
      const inputFieldRefs = document.querySelectorAll('input')
      inputFieldRefs.forEach(e => {
        if (!gameSettings.includes(e.name)) {
            gameSettings.push(e.name)
        }
      })
        collectGameSettings()
  })
  
}

/**
 * Collects and refreshes necessary game-settings in an Array
 * Initiate gameStart-Function
 */
function collectGameSettings() {
    gameSettingsPicked = [];
    gameSettings.forEach(e  => {
        let radios = document.getElementsByName(e);
      [...radios].forEach((e) => (addGameSetting(e as HTMLInputElement))
    )})
    gameStart()
}

/**
 * Adds the Game-Setting to the gameSettingsPicked-Array 
 * @param e - the according Game-Setting
 */
function addGameSetting(e:HTMLInputElement) {
    if(e.checked && e.dataset.preview){
        gameSettingsPicked.push(e.dataset.preview)
        return
    } 
}

/**
 * If all required game-settings are collected, it will store it into session storage 
 */
function gameStart() {
    if (gameSettingsPicked.length >= 3) {
        window.open('game.html', '_self')
        sessionStorage.setItem('memory', JSON.stringify(gameSettingsPicked));
    }
}

initGame();
/**
 * Loads game screen
 * It renders header and gameBoard separately
 */
function initGame() {
    addEventListener('load', () => {
        const header = document.getElementById('header') as HTMLElement;
        const gameBoard = document.getElementById('board') as HTMLElement;
        header.innerHTML = loadHeader();
        gameBoard.innerHTML = loadBoard();
                
     
        
    })    
}