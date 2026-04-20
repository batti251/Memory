import './styles/main.scss';
import { loadHeader, loadBoard, loadPage } from './templates/template';
import { playersFirstTurn, exitGameBtn , gameEnd} from './scripts/game';

let gameSettings: string[] = [];
export let gameSettingsPicked: string[] = [];
let btn = document.getElementById('btn-start') as HTMLButtonElement;

checkGameRequirements()
initSetting();
initGame();
settingsListener();

/**
 * init-function on load for settings-page
 * it resets all Input-fields
 */
function initSetting() {
    const url = window.location.href
    window.addEventListener('load', () => {
        if (url.includes('settings')) {
            resetInputs();
        }
    })
}

/**
 * unchecks all Input-Elements
 */
function resetInputs() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(i => {
        i.checked = false
    })
}

/**
 * Initializes Game preload. 
 * Creates gameSetting-Array according to unique inputField-names
 */
function checkGameRequirements() {
    const inputFieldRefs = document.querySelectorAll('input')
    btn ? btn.disabled = true : "";
    inputFieldRefs.forEach(e => e.addEventListener('click', () => {
        inputFieldRefs.forEach(e => {
            if (!gameSettings.includes(e.name)) {
                gameSettings.push(e.name)
            }
        })
        collectGameSettings()
    }))
}

/**
 * Collects and refreshes necessary game-settings in an Array
 * Initiate gameStart-Function
 */
function collectGameSettings() {
    gameSettingsPicked = [];
    gameSettings.forEach(e => {
        let radios = document.getElementsByName(e);
        radios.forEach((e) => (addGameSetting(e as HTMLInputElement))
        )
    })
    enableBtn()
}

/**
 * Adds the Game-Setting to the gameSettingsPicked-Array 
 * @param e - all Input-Elements
 */
function addGameSetting(e: HTMLInputElement) {
    if (e.checked && e.dataset.preview) {
        gameSettingsPicked.push(e.dataset.preview)
        return
    }
}

/**
 * If all required game-settings are collected, the start button will be enabled
 */
function enableBtn() {
    if (gameSettingsPicked.length >= 3) {
        btn.disabled = false;
        startGame()
    }
}

/**
 * Starts the game, if the start-button is enabled
 */
function startGame() {
    btn.addEventListener('click', () => {
        if (!btn.disabled) {
            window.open('game.html', '_self')
            sessionStorage.setItem('memory', JSON.stringify(gameSettingsPicked));
        }
    })
}

/**
 * Loads game screen
 * It renders header and gameBoard separately
 */
function initGame() {
    addEventListener('load', () => {
        const page = document.querySelector('.page')
        if (page) {
            playersFirstTurn();
            page.outerHTML = loadPage();
            loadGame();
            exitGameBtn();
        }
    })
}

/**
 * initiates the header and gameboard according to the preselect settings 
 */
function loadGame() {
      const header = document.getElementById('header') as HTMLElement;
      const gameBoard = document.getElementById('board') as HTMLElement;
            header.innerHTML = loadHeader();
            gameBoard.innerHTML = loadBoard();
}

/**
 * Function handler, according to the inputs-target-name
 * Calls updateFunction, with predefined strings, for DOM-manipulation
 */
function settingsListener() {
    addEventListener('change', (e) => {
        switch ((e.target as HTMLInputElement).getAttribute("name")) {
            case "game-theme":
                updateSettingBar((e.target) as HTMLInputElement, 0, "theme", "");
                break;
            case "player-color":
                updateSettingBar((e.target) as HTMLInputElement, 1, "Player", "");
                break;
            default: updateSettingBar((e.target) as HTMLInputElement, 2, "Cards", "Board-");
                break;
        }
    })
}

/**
 * Updates the text in the settings bar based on the selected input element.
 * 
 * @param e - the targeted Input-element
 * @param i - index from the setting-bar (0: theme, 1: first playerm 2: board size)
 * @param s - suffix appended to the displayed text.
 * @param p - prefix prepended to the displayed text. 
 */
function updateSettingBar(e: HTMLInputElement, i: number, s: string, p: string) {
    const settingsBarRef = document.querySelectorAll('.settings__bar-list')
    const settingsBar = settingsBarRef[0].children[i] as HTMLElement;
    const gameTheme = e.dataset.preview as string;
    settingsBar.dataset.picked = "false";
    if (gameTheme == "da") {
        settingsBar.innerHTML = gameTheme.toUpperCase() + " " + s
        settingsBar.dataset.picked = "true";
    } else {
        settingsBar.innerHTML = p + gameTheme.charAt(0).toUpperCase() + gameTheme.slice(1) + " " + s
        settingsBar.dataset.picked = "true";
    }
}

