export default class Color {
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    static fromHex(hex: string): Color {
        // remove leading #
        if (hex[0] === "#") {
            hex = hex.slice(1);
        }
        let r = parseInt(hex.slice(0, 2), 16);
        let g = parseInt(hex.slice(2, 4), 16);
        let b = parseInt(hex.slice(4, 6), 16);
        return new Color(r, g, b);
    }

    toHex(): string {
        let r = this.r.toString(16).padStart(2, "0");
        let g = this.g.toString(16).padStart(2, "0");
        let b = this.b.toString(16).padStart(2, "0");
        return "#" + r + g + b;
    }

    inverted(): Color {
        return new Color(255 - this.r, 255 - this.g, 255 - this.b);
    }

    static invertedHex(hex: string): string {
        return Color.fromHex(hex).inverted().toHex();
    }

    darkened(amount: number, floor: number = 0): Color {
        return new Color(
            Math.max(floor, Math.floor(this.r - amount)),
            Math.max(floor, Math.floor(this.g - amount)),
            Math.max(floor, Math.floor(this.b - amount)),
        );
    }

    static darkenedHex(hex: string, amount: number, floor: number = 0): string {
        return Color.fromHex(hex).darkened(amount, floor).toHex();
    }

    lightened(amount: number, ceil: number = 255): Color {
        return new Color(
            Math.min(ceil, Math.floor(this.r + amount)),
            Math.min(ceil, Math.floor(this.g + amount)),
            Math.min(ceil, Math.floor(this.b + amount)),
        );
    }

    static lightenedHex(hex: string, amount: number, ceil: number = 255): string {
        return Color.fromHex(hex).lightened(amount, ceil).toHex();
    }

}

class Palette {
    colors: Color[];
    constructor(colors: Color[]) {
        this.colors = colors;
    }
    
    static fromHexes(hexes: string[]): Palette {
        return new Palette(hexes.map(hex => Color.fromHex(hex)));
    }
}

const PALETTES: Palette[] = [
    Palette.fromHexes(["be6e46","cde7b0","a3bfa8","7286a0","59594a"]),
    Palette.fromHexes(["adbca5","e8b9ab","e09891","cb769e","8c5f66"]),
    Palette.fromHexes(["7fb069","fffbbd","e6aa68","ca3c25","1d1a05"]),
    Palette.fromHexes(["545e75","63adf2","a7cced","304d6d","82a0bc"]),
    Palette.fromHexes(["ff9fb2","fbdce2","0acdff","60ab9a","dedee0"]),
    Palette.fromHexes(["91f9e5","76f7bf","5fdd9d","499167","3f4531"]),
    Palette.fromHexes(["ffc857","e9724c","c5283d","481d24","255f85"]),
    Palette.fromHexes(["bce7fd","c492b1","af3b6e","424651","21fa90"]),
];

export function getPalette(index: number = 0): Color[] {
    return PALETTES[index].colors;
}

export function getRandomPalette(): Color[] {
    return PALETTES[Math.floor(Math.random() * PALETTES.length)].colors;
}

export const GRAY = Color.fromHex("#C0C0C0");