import { DeckConfig, Card } from "../interfaces/cards-interface";

export class CardDeck implements DeckConfig {
    src: number[];
    theme: string[];
    cards: Card[] = [];

    constructor(src: number[], theme: string[]) {
        this.src = src;
        this.theme = theme;
        this.cards = initCardDeck(src, theme);
    }
}

/**
 * creates card objects with preloaded images based on given card-IDs and theme
 * 
 * @param src - all card-ID's for the current game
 * @param theme - list of the current game-settings
 * @returns - list of Card objects
 */
function initCardDeck(src: number[], theme: string[]): Card[] {
    return src.map((e) => {
        const imagePath = `/decks/theme_${theme[0]}/cards/card_${e}.svg`;
        const img = new Image();
        img.src = imagePath;

        return {
            src: imagePath,
            img: img
        };
    });
}