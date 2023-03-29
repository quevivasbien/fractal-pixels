import React from "react";

import Color from "@/scripts/colors";
import type { PixelProps } from "@/scripts/renderData";

interface PixelProps_ {
    props: PixelProps;
}

export default class Pixel extends React.Component<PixelProps_, PixelProps> {
    constructor(props_: PixelProps_) {
        super(props_);
        this.state = props_.props;
    }

    render() {
        const { baseColor, color, filled, number, selected, borders } = this.state;
        const topBorder = borders.top ? 'border-t-gray-400' : 'border-t-gray-200';
        const bottomBorder = borders.bottom ? 'border-b-gray-400' : 'border-b-gray-200';
        const leftBorder = borders.left ? 'border-l-gray-400' : 'border-l-gray-200';
        const rightBorder = borders.right ? 'border-r-gray-400' : 'border-r-gray-200';
        const border = `${topBorder} ${bottomBorder} ${leftBorder} ${rightBorder}`;
        const cursorType = filled || selected || number !== '' ? 'cursor-pointer' : 'cursor';
        const className = `flex justify-center items-center w-8 h-8 border ${border} hover:border-gray-400 ${cursorType} select-none`;
        if (filled || selected) {
            const style = {
                backgroundColor: color,
                color: Color.invertedHex(baseColor),
            };
            return (
                <div className={className} style={style}>
                    {number}
                </div>
            );
        }
        else {
            return (
                <div className={className} style={{ color: Color.darkenedHex(baseColor, 50) }} >
                    {number}
                </div>
            );
        }
    }
}