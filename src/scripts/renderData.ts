interface PixelBorders {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}
const DEFAULT_BORDERS: PixelBorders = {
    top: false,
    bottom: false,
    left: false,
    right: false,
};


export class PixelProps {
    baseColor: string;
    color: string;
    filled: boolean;
    number: string;
    selected: boolean;
    holdsBlock?: BlockBounds;
    borders: PixelBorders = {...DEFAULT_BORDERS};

    constructor(baseColor: string, color: string = "#ffffff", filled: boolean = false, number: string = "?", selected: boolean = false) {
        this.baseColor = baseColor;
        this.color = color;
        this.filled = filled;
        this.number = number;
        this.selected = selected;
    }

    getKey(): string {
        const borderKey = (this.borders.top ? "1" : "0") + (this.borders.bottom ? "1" : "0") + (this.borders.left ? "1" : "0") + (this.borders.right ? "1" : "0");
        return this.baseColor + this.color + (this.filled ? "1" : "0") + this.number + (this.selected ? "1" : "0") + borderKey;
    }
}

export class BlockBounds {
    startX: number;
    startY: number;
    endX: number;
    endY: number;

    constructor(startX: number, startY: number, endX: number, endY: number) {
        if (startX > endX || startY > endY) {
            throw new Error("Invalid block bounds");
        }
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }

    area(): number {
        return (1 + this.endX - this.startX) * (1 + this.endY - this.startY);
    }

    contains(x: number, y: number): boolean {
        return this.startX <= x && x <= this.endX && this.startY <= y && y <= this.endY;
    }
}

export default class RenderData {
    height: number;
    width: number;
    pixels: PixelProps[];

    constructor(height: number, width: number, pixels: PixelProps[]) {
        this.height = height;
        this.width = width;
        this.pixels = pixels;
    }

    static fromColors(height: number, width: number, colors: string[]): RenderData {
        const pixels: PixelProps[] = colors.map((color) => {
            return new PixelProps(color);
        });
        return new RenderData(height, width, pixels);
    }

    static initImage(height: number, width: number, colors: string[]): RenderData {
        const renderData = RenderData.fromColors(height, width, colors);
        renderData.init();
        return renderData;
    }

    init(): void {
        const nSingleBlocks = Math.floor(this.width * this.height * 0.02);
        for (let i = 0; i < nSingleBlocks; i++) {
            const index = Math.floor(Math.random() * this.pixels.length);
            const pixel = this.pixels[index];
            pixel.number = "1";
            pixel.filled = true;
            pixel.color = pixel.baseColor;
            const x = index % this.width;
            const y = Math.floor(index / this.width);
            pixel.holdsBlock = new BlockBounds(x, y, x, y);
            this.paintBlock(pixel.holdsBlock, pixel.baseColor);
        }
        while (true) {
            const seedIndex = this.randomEmptyIndex();
            if (seedIndex === -1) {
                break;
            }
            this.fillMaxBlock(seedIndex);
        }
    }

    resetBorders(): void {
        // clear existing borders
        for (const pixel of this.pixels) {
            pixel.borders = {...DEFAULT_BORDERS};
        }
        // redraw all borders
        for (const pixel of this.pixels) {
            if (pixel.holdsBlock) {
                this.setBorders(pixel.holdsBlock);
            }
        }
    }
    setBorders(block: BlockBounds): void {
        for (let i = Math.max(0, block.startY - 1); i <= Math.min(this.height - 1, block.endY + 1); i++) {
            for (let j = Math.max(0, block.startX - 1); j <= Math.min(this.width - 1, block.endX + 1); j++) {
                const index = i * this.width + j;
                const pixel = this.pixels[index];
                if (j >= block.startX && j <= block.endX && (i === block.startY || i === block.endY + 1)) {
                    pixel.borders.top = true;
                }
                if (j >= block.startX && j <= block.endX && (i === block.endY || i === block.startY - 1)) {
                    pixel.borders.bottom = true;
                }
                if (i >= block.startY && i <= block.endY && (j === block.startX || j === block.endX + 1)) {
                    pixel.borders.left = true;
                }
                if (i >= block.startY && i <= block.endY && (j === block.endX || j === block.startX - 1)) {
                    pixel.borders.right = true;
                }
            }
        }
    }

    paintBlock(block: BlockBounds, color: string, fill = true): void {
        for (let i = block.startY; i <= block.endY; i++) {
            for (let j = block.startX; j <= block.endX; j++) {
                const index = i * this.width + j;
                this.pixels[index].color = color;
                if (fill) {
                    this.pixels[index].filled = true;
                }
            }
        }
    }

    private randomEmptyIndex(): number {
        const emptyIndices = [];
        for (let i = 0; i < this.pixels.length; i++) {
            if (this.pixels[i].number === "?") {
                emptyIndices.push(i);
            }
        }
        if (emptyIndices.length === 0) {
            return -1;
        }
        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    private fillMaxBlock(seedIndex: number): void {
        let [bottomRightIndex, bottomRightArea] = this.findMaxBlockFromTopLeft(seedIndex);
        let fromDirection = "tl";
        let [bestIndex, bestArea] = [bottomRightIndex, bottomRightArea];
        
        let [bottomLeftIndex, bottomLeftArea] = this.findMaxBlockFromTopRight(seedIndex);
        if (bottomLeftArea > bestArea) {
            [bestIndex, bestArea] = [bottomLeftIndex, bottomLeftArea];
            fromDirection = "tr";
        }

        let [topRightIndex, topRightArea] = this.findMaxBlockFromBottomLeft(seedIndex);
        if (topRightArea > bestArea) {
            [bestIndex, bestArea] = [topRightIndex, topRightArea];
            fromDirection = "bl";
        }

        let [topLeftIndex, topLeftArea] = this.findMaxBlockFromBottomRight(seedIndex);
        if (topLeftArea > bestArea) {
            [bestIndex, bestArea] = [topLeftIndex, topLeftArea];
            fromDirection = "br";
        }
        
        const bounds = this.getBlockBounds(seedIndex, bestIndex, fromDirection);
        this.clearBlock(bounds);
        this.pixels[seedIndex].number = bestArea.toString();
        if (bestArea === 1) {
            const seedPixel = this.pixels[seedIndex];
            seedPixel.holdsBlock = bounds;
            this.paintBlock(bounds, seedPixel.baseColor);
        }
    }

    private getBlockBounds(seedIndex: number, bestIndex: number, fromDirection: string): BlockBounds {
        if (fromDirection === "tl") {
            return new BlockBounds(
                seedIndex % this.width,
                Math.floor(seedIndex / this.width),
                bestIndex % this.width,
                Math.floor(bestIndex / this.width),
            );
        }
        if (fromDirection === "tr") {
            return new BlockBounds(
                bestIndex % this.width,
                Math.floor(seedIndex / this.width),
                seedIndex % this.width,
                Math.floor(bestIndex / this.width),
            );
        }
        if (fromDirection === "bl") {
            return new BlockBounds(
                seedIndex % this.width,
                Math.floor(bestIndex / this.width),
                bestIndex % this.width,
                Math.floor(seedIndex / this.width),
            );
        }
        if (fromDirection === "br") {
            return new BlockBounds(
                bestIndex % this.width,
                Math.floor(bestIndex / this.width),
                seedIndex % this.width,
                Math.floor(seedIndex / this.width),
            );
        }
        throw new Error("Invalid fromDirection");
    }

    private clearBlock(bounds: BlockBounds): void {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                // continue if pixel not in the rectangle
                if (!bounds.contains(i, j)) {
                    continue;
                }
                const index = j * this.width + i;
                this.pixels[index].number = "";
            }
        }
    }

    private getRightNeighborIndex(index: number): number {
        const next = index + 1;
        if (next % this.width === 0 || this.pixels[next].number !== "?" || this.pixels[next].baseColor !== this.pixels[index].baseColor) {
            // reached end of row or next pixel is filled
            return -1;
        }
        return next;
    }
    
    private getLeftNeighborIndex(index: number): number {
        const next = index - 1;
        if (next < 0 || next % this.width === this.width - 1 || this.pixels[next].number !== "?" || this.pixels[next].baseColor !== this.pixels[index].baseColor) {
            // reached end of row or next pixel is filled
            return -1;
        }
        return next;
    }
    
    private getBottomNeighborIndex(index: number): number {
        const next = index + this.width;
        if (next >= this.width * this.height || this.pixels[next].number !== "?" || this.pixels[next].baseColor !== this.pixels[index].baseColor) {
            // reached end of column or next pixel is filled
            return -1;
        }
        return next;
    }
    
    private getTopNeighborIndex(index: number): number {
        const next = index - this.width;
        if (next < 0 || this.pixels[next].number !== "?" || this.pixels[next].baseColor !== this.pixels[index].baseColor) {
            // reached end of column or next pixel is filled
            return -1;
        }
        return next;
    }

    private rowFromLeftIsClear(endIndex: number, numRightSteps: number): boolean {
        let index = endIndex;
        for (let i = 0; i < numRightSteps; i++) {
            const nextLeftNeighbor = this.getLeftNeighborIndex(index);
            if (nextLeftNeighbor === -1) {
                return false;
            }
            index = nextLeftNeighbor;
        }
        return true;
    }

    private rowFromRightIsClear( endIndex: number, numLeftSteps: number): boolean {
        let index = endIndex;
        for (let i = 0; i < numLeftSteps; i++) {
            const nextRightNeighbor = this.getRightNeighborIndex(index);
            if (nextRightNeighbor === -1) {
                return false;
            }
            index = nextRightNeighbor;
        }
        return true;
    }

    private findMaxBlockFromTopLeft(seedIndex: number): [number, number] {
        let bestArea = 1;
        let bestIndex = seedIndex;
        let topRightIndex = seedIndex;
        let numRightSteps = 0;
        while (true) {
            [bestArea, bestIndex] = this.stepDownFromTopLeft(topRightIndex, numRightSteps, bestArea, bestIndex);
            const nextRightNeighbor = this.getRightNeighborIndex(topRightIndex);
            if (nextRightNeighbor === -1) {
                break;
            }
            topRightIndex = nextRightNeighbor;
            numRightSteps++;
        }
        return [bestIndex, bestArea];
    }

    private stepDownFromTopLeft(topRightIndex: number, numRightSteps: number, bestArea: number, bestIndex: number): [number, number] {
        let numDownSteps = 0;
        // step down until blocked
        let candidateIndex = topRightIndex;
        while (true) {
            const nextBottomNeighbor = this.getBottomNeighborIndex(candidateIndex);
            if (nextBottomNeighbor === -1 || !this.rowFromLeftIsClear(nextBottomNeighbor, numRightSteps)) {
                const newArea = (numRightSteps + 1) * (numDownSteps + 1);
                if (newArea > bestArea) {
                    bestArea = newArea;
                    bestIndex = candidateIndex;
                }
                break;
            }
            candidateIndex = nextBottomNeighbor;
            numDownSteps++;
        }
        return [bestArea, bestIndex];
    }

    private findMaxBlockFromTopRight(seedIndex: number): [number, number] {
        let bestArea = 1;
        let bestIndex = seedIndex;
        let topLeftIndex = seedIndex;
        let numLeftSteps = 0;
        while (true) {
            [bestArea, bestIndex] = this.stepDownFromTopRight(topLeftIndex, numLeftSteps, bestArea, bestIndex);
            const nextLeftNeighbor = this.getLeftNeighborIndex(topLeftIndex);
            if (nextLeftNeighbor === -1) {
                break;
            }
            topLeftIndex = nextLeftNeighbor;
            numLeftSteps++;
        }
        return [bestIndex, bestArea];
    }

    private stepDownFromTopRight(topLeftIndex: number, numLeftSteps: number, bestArea: number, bestIndex: number): [number, number] {
        let numDownSteps = 0;
        // step down until blocked
        let candidateIndex = topLeftIndex;
        while (true) {
            const nextBottomNeighbor = this.getBottomNeighborIndex(candidateIndex);
            if (nextBottomNeighbor === -1 || !this.rowFromRightIsClear( nextBottomNeighbor, numLeftSteps)) {
                const newArea = (numLeftSteps + 1) * (numDownSteps + 1);
                if (newArea > bestArea) {
                    bestArea = newArea;
                    bestIndex = candidateIndex;
                }
                break;
            }
            candidateIndex = nextBottomNeighbor;
            numDownSteps++;
        }
        return [bestArea, bestIndex];
    }

    private findMaxBlockFromBottomLeft(seedIndex: number): [number, number] {
        let bestArea = 1;
        let bestIndex = seedIndex;
        let bottomRightIndex = seedIndex;
        let numRightSteps = 0;
        while (true) {
            [bestArea, bestIndex] = this.stepUpFromBottomLeft(bottomRightIndex, numRightSteps, bestArea, bestIndex);
            const nextRightNeighbor = this.getRightNeighborIndex(bottomRightIndex);
            if (nextRightNeighbor === -1) {
                break;
            }
            bottomRightIndex = nextRightNeighbor;
            numRightSteps++;
        }
        return [bestIndex, bestArea];
    }

    private stepUpFromBottomLeft(bottomRightIndex: number, numRightSteps: number, bestArea: number, bestIndex: number): [number, number] {
        let numUpSteps = 0;
        // step up until blocked
        let candidateIndex = bottomRightIndex;
        while (true) {
            const nextTopNeighbor = this.getTopNeighborIndex(candidateIndex);
            if (nextTopNeighbor === -1 || !this.rowFromLeftIsClear(nextTopNeighbor, numRightSteps)) {
                const newArea = (numRightSteps + 1) * (numUpSteps + 1);
                if (newArea > bestArea) {
                    bestArea = newArea;
                    bestIndex = candidateIndex;
                }
                break;
            }
            candidateIndex = nextTopNeighbor;
            numUpSteps++;
        }
        return [bestArea, bestIndex];
    }

    private findMaxBlockFromBottomRight(seedIndex: number): [number, number] {
        let bestArea = 1;
        let bestIndex = seedIndex;
        let bottomLeftIndex = seedIndex;
        let numLeftSteps = 0;
        while (true) {
            [bestArea, bestIndex] = this.stepUpFromBottomRight(bottomLeftIndex, numLeftSteps, bestArea, bestIndex);
            const nextLeftNeighbor = this.getLeftNeighborIndex(bottomLeftIndex);
            if (nextLeftNeighbor === -1) {
                break;
            }
            bottomLeftIndex = nextLeftNeighbor;
            numLeftSteps++;
        }
        return [bestIndex, bestArea];
    }

    private stepUpFromBottomRight(bottomLeftIndex: number, numLeftSteps: number, bestArea: number, bestIndex: number): [number, number] {
        let numUpSteps = 0;
        // step up until blocked
        let candidateIndex = bottomLeftIndex;
        while (true) {
            const nextTopNeighbor = this.getTopNeighborIndex(candidateIndex);
            if (nextTopNeighbor === -1 || !this.rowFromRightIsClear(nextTopNeighbor, numLeftSteps)) {
                const newArea = (numLeftSteps + 1) * (numUpSteps + 1);
                if (newArea > bestArea) {
                    bestArea = newArea;
                    bestIndex = candidateIndex;
                }
                break;
            }
            candidateIndex = nextTopNeighbor;
            numUpSteps++;
        }
        return [bestArea, bestIndex];
    }
}
