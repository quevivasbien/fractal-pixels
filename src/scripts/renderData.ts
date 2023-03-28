export interface PixelProps {
    color: string;
    filled: boolean;
    number: string;
}

interface BlockBounds {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export default class RenderData {
    height: number;
    width: number;
    pixels: PixelProps[];

    constructor(height: number, width: number, colors: string[]) {
        this.height = height;
        this.width = width;
        this.pixels = colors.map((color) => {
            return {
                color: color,
                filled: false,
                number: "?",
            }
        });
    }

    static initImage(height: number, width: number, colors: string[]): RenderData {
        const renderData = new RenderData(height, width, colors);
        renderData.init();
        return renderData;
    }

    init(): void {
        const nSingleBlocks = Math.floor(this.width * this.height * 0.02);
        for (let i = 0; i < nSingleBlocks; i++) {
            const index = Math.floor(Math.random() * this.pixels.length);
            this.pixels[index].number = "1";
            this.pixels[index].filled = true;
        }
        while (true) {
            const seedIndex = this.randomEmptyIndex();
            if (seedIndex === -1) {
                break;
            }
            this.fillMaxBlock(seedIndex);
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
            this.pixels[seedIndex].filled = true;
        }
    }

    private getBlockBounds(seedIndex: number, bestIndex: number, fromDirection: string): BlockBounds {
        if (fromDirection === "tl") {
            return {
                startX: seedIndex % this.width,
                startY: Math.floor(seedIndex / this.width),
                endX: bestIndex % this.width,
                endY: Math.floor(bestIndex / this.width),
            };
        }
        if (fromDirection === "tr") {
            return {
                startX: bestIndex % this.width,
                startY: Math.floor(seedIndex / this.width),
                endX: seedIndex % this.width,
                endY: Math.floor(bestIndex / this.width),
            };
        }
        if (fromDirection === "bl") {
            return {
                startX: seedIndex % this.width,
                startY: Math.floor(bestIndex / this.width),
                endX: bestIndex % this.width,
                endY: Math.floor(seedIndex / this.width),
            };
        }
        if (fromDirection === "br") {
            return {
                startX: bestIndex % this.width,
                startY: Math.floor(bestIndex / this.width),
                endX: seedIndex % this.width,
                endY: Math.floor(seedIndex / this.width),
            };
        }
        throw new Error("Invalid fromDirection");
    }

    private clearBlock(bounds: BlockBounds): void {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                // continue if pixel not in the rectangle
                if (i < bounds.startX || i > bounds.endX || j < bounds.startY || j > bounds.endY) {
                    continue;
                }
                const index = j * this.width + i;
                this.pixels[index].number = "";  // mark as not ?
            }
        }
    }

    private getRightNeighborIndex(index: number): number {
        const next = index + 1;
        if (next % this.width === 0 || this.pixels[next].number !== "?" || this.pixels[next].color !== this.pixels[index].color) {
            // reached end of row or next pixel is filled
            return -1;
        }
        return next;
    }
    
    private getLeftNeighborIndex(index: number): number {
        const next = index - 1;
        if (next < 0 || next % this.width === this.width - 1 || this.pixels[next].number !== "?" || this.pixels[next].color !== this.pixels[index].color) {
            // reached end of row or next pixel is filled
            return -1;
        }
        return next;
    }
    
    private getBottomNeighborIndex(index: number): number {
        const next = index + this.width;
        if (next >= this.width * this.height || this.pixels[next].number !== "?" || this.pixels[next].color !== this.pixels[index].color) {
            // reached end of column or next pixel is filled
            return -1;
        }
        return next;
    }
    
    private getTopNeighborIndex(index: number): number {
        const next = index - this.width;
        if (next < 0 || this.pixels[next].number !== "?" || this.pixels[next].color !== this.pixels[index].color) {
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
