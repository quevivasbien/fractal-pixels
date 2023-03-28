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

    darkened(amount: number): Color {
        return new Color(
            Math.max(0, Math.floor(this.r * (1 - amount))),
            Math.max(0, Math.floor(this.g * (1 - amount))),
            Math.max(0, Math.floor(this.b * (1 - amount))),
        );
    }

    static darkenedHex(hex: string, amount: number): string {
        return Color.fromHex(hex).darkened(amount).toHex();
    }

}