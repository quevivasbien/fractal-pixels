import React from "react";

import RenderData, { BlockBounds } from "@/scripts/renderData";
import Pixel from "@/components/Pixel";
import Color, { GRAY } from "@/scripts/colors";

interface GridImageProps {
    height: number;
    width: number;
    colors: string[];
}

interface GridImageState {
    renderData: RenderData;
    selectStart?: number;
    selectEnd?: number;
}

export default class GridImage extends React.Component<GridImageProps, GridImageState> {
    constructor(props: GridImageProps) {
        super(props);
        this.state = {
            renderData: RenderData.initImage(props.height, props.width, props.colors),
            selectStart: undefined,
            selectEnd: undefined,
        };
    }

    render() {
        this.state.renderData.resetBorders();
        const { height, width, pixels } = this.state.renderData;
        const rows = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const index = y * width + x;
                const pixel = pixels[index];
                row.push(
                    <div key={`${x}`} onMouseDown={() => this.onMouseDown(x, y)} onMouseOver={() => this.onMouseOver(x, y)}>
                        <Pixel key={pixel.getKey()} props={pixel} />
                    </div>
                );
            }
            rows.push(<div key={y} className="flex">{row}</div>);
        }
        return (
            <div onMouseUp={() => this.onMouseUp()}>
                {rows}
            </div>
        );
    }

    onMouseDown(x: number, y: number) {
        const renderData = this.state.renderData;
        const index = x + renderData.width * y;
        const pixel = renderData.pixels[index];
        if (pixel.filled) {
            this.unfillBlock(x, y);
        }
        if (pixel.number === '') {
            // don't allow select of non-numbered pixels
            return;
        }
        this.setState({ selectStart: index, selectEnd: index }, this.drawSelectBox);
    }

    getBlockHolderIndex(x: number, y: number): number {
        // finds the block that contains the pixel at (x, y)
        const pixels = this.state.renderData.pixels;
        for (let i = 0; i < pixels.length; i++) {
            const pixel = pixels[i];
            if (pixel.holdsBlock !== undefined && pixel.holdsBlock.contains(x, y)) {
                return i;
            }
        }
        throw new Error("no block found");
    }

    unfillBlock(x: number, y: number) {
        // find the block that contains the pixel at (x, y)
        const renderData = this.state.renderData;
        let blockHolderIndex = this.getBlockHolderIndex(x, y)
        const block = renderData.pixels[blockHolderIndex].holdsBlock;
        if (block === undefined) {
            throw new Error("this should never happen!");
        }
        // unfill the block
        for (let i = block.startY; i <= block.endY; i++) {
            for (let j = block.startX; j <= block.endX; j++) {
                const index = i * renderData.width + j;
                const pixel = renderData.pixels[index];
                pixel.filled = false;
            }
        }
        // clear the block holder
        renderData.pixels[blockHolderIndex].holdsBlock = undefined;
        this.setState({ renderData: renderData });
    }

    // selection box is drawn when mouse is down and mouse is moved
    drawSelectBox() {
        if (this.state.selectStart === undefined || this.state.selectEnd === undefined) {
            // wait a bit and retry
            setTimeout(() => this.drawSelectBox(), 100);
            return;
        }
        const selectStart = this.state.selectStart;
        const startPixel = this.state.renderData.pixels[selectStart];

        const renderData = this.state.renderData;
        
        const startI = Math.floor(selectStart / renderData.width);
        const startJ = selectStart % renderData.width;
        const endI = Math.floor(this.state.selectEnd / renderData.width);
        const endJ = this.state.selectEnd % renderData.width;
        const bounds = new BlockBounds(Math.min(startJ, endJ), Math.min(startI, endI), Math.max(startJ, endJ), Math.max(startI, endI));
        startPixel.holdsBlock = bounds;
        for (let i = 0; i < renderData.height; i++) {
            for (let j = 0; j < renderData.width; j++) {
                const pixel = renderData.pixels[i * renderData.width + j];
                if (bounds.contains(j, i)) {
                    pixel.selected = true;
                    pixel.color = bounds.area() === parseInt(startPixel.number) ? Color.lightenedHex(startPixel.baseColor, 50, 230) : GRAY.toHex();
                }
                else {
                    pixel.selected = false;
                }
            }
        }
        this.setState({ renderData: renderData });
    }

    // selection box is drawn when mouse is down and mouse is moved
    // when mouse is released, the selection box is cleared
    clearSelectBox() {
        const renderData = this.state.renderData;
        // clear selection box
        for (let i = 0; i < renderData.height; i++) {
            for (let j = 0; j < renderData.width; j++) {
                renderData.pixels[i * renderData.width + j].selected = false;
            }
        }
        // set colors for (now-unselected) selected pixels
        const selectStart = this.state.selectStart;
        const selectEnd = this.state.selectEnd;
        if (selectStart === undefined || selectEnd === undefined) {
            throw new Error("selectStart or selectEnd shouldn't be undefined here");
        }
        const block = new BlockBounds(
            Math.min(selectStart % renderData.width, selectEnd % renderData.width),
            Math.min(Math.floor(selectStart / renderData.width), Math.floor(selectEnd / renderData.width)),
            Math.max(selectStart % renderData.width, selectEnd % renderData.width),
            Math.max(Math.floor(selectStart / renderData.width), Math.floor(selectEnd / renderData.width)),
        );
        const startPixel = renderData.pixels[selectStart];
        const color = parseInt(startPixel.number) === block.area() ? startPixel.baseColor : GRAY.toHex();
        renderData.paintBlock(block, color);
        startPixel.holdsBlock = block;
        // update state
        this.setState({ selectStart: undefined, selectEnd: undefined, renderData: renderData });
    }

    onMouseOver(x: number, y: number) {
        if (this.state.selectStart === undefined) {
            // only pay attention if we're in the middle of a selection
            return;
        }
        if (this.boxIsClear(x, y)) {
            this.setState({ selectEnd: x + this.state.renderData.width * y }, this.drawSelectBox);
        }
    }

    boxIsClear(x: number, y: number): boolean {
        if (this.state.selectStart === undefined) {
            throw new Error("selectStart is undefined");
        }
        const startX = this.state.selectStart % this.state.renderData.width;
        const startY = Math.floor(this.state.selectStart / this.state.renderData.width);
        for (let y_ = Math.min(startY, y); y_ <= Math.max(startY, y); y_++) {
            for (let x_ = Math.min(startX, x); x_ <= Math.max(startX, x); x_++) {
                const index = y_ * this.state.renderData.width + x_;
                if (index === this.state.selectStart) {
                    continue;
                }
                if (
                    this.state.renderData.pixels[index].number !== '' ||
                    this.state.renderData.pixels[index].filled
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    onMouseUp() {
        if (this.state.selectStart === undefined) {
            return;
        }
        this.clearSelectBox();
    }
}