import { DeckConfig, Card } from "../interfaces/cards-interface";

export class CardDeck implements DeckConfig {
    src: number[];
    setup: string[];
    cards: Card[] = [];

    constructor(src: number[], setup: string[]) {
        this.src = src;
        this.setup = setup;
        this.cards = initCardDeck(src, setup);
    }
}

function initCardDeck(src: number[], setup: string[]): Card[] {
    return src.map((e) => {
        const imagePath = `/decks/theme_${setup[0]}/cards/card_${e}.svg`;
        const img = new Image();
        img.src = imagePath;

        return {
            src: imagePath,
            img: img
        };
    });
}