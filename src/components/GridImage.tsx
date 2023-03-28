import React from "react";

import RenderData from "@/scripts/renderData";
import Pixel from "@/components/Pixel";

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
    constructor({ height, width, colors }: GridImageProps) {
        super({ height, width, colors });
        this.state = { renderData: RenderData.initImage(height, width, colors) };
    }

    render() {
        const { height, width, pixels } = this.state.renderData;
        const rows = [];
        for (let i = 0; i < height; i++) {
            const row = [];
            for (let j = 0; j < width; j++) {
                const index = i * width + j;
                const pixel = pixels[index];
                row.push(
                    <div onMouseDown={() => this.onMouseDown(i, j)} onMouseOver={() => this.onMouseOver(i, j)}>
                        <Pixel key={`${i}${j}`} color={pixel.color} filled={pixel.filled} number={pixel.number} />
                    </div>
                );
            }
            rows.push(<div key={i} className="flex">{row}</div>);
        }
        return (
            <div onMouseUp={this.onMouseUp}>
                {rows}
            </div>
        );
    }

    onMouseDown(i: number, j: number) {
        console.log("clicked: " + i + ", " + j);
        const renderData = this.state.renderData;
        const index = i * renderData.width + j;
        if (renderData.pixels[index].number === '') {
            // don't allow select of non-numbered pixels
            return;
        }
        this.setState({ selectStart: index });
        // const index = i * renderData.width + j;
        // const pixel = renderData.pixels[index];
        // pixel.filled = !pixel.filled;
        // this.setState({ renderData: renderData });
    }

    onMouseOver(i: number, j: number) {
        if (this.state.selectStart === undefined) {
            // only pay attention if we're in the middle of a selection
            return;
        }
        console.log("mouse over: " + i + ", " + j);
    }

    onMouseUp() {
        console.log("mouse up");
        this.setState({ selectStart: undefined, selectEnd: undefined });
    }
}