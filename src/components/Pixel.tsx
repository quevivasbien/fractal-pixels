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
        const { baseColor, color, filled, number, selected } = this.state;
        const borderColor = selected ? 'border-red-800' : 'border-gray-200';
        const hoverBorderColor = selected ? 'border-red-600' : 'border-gray-400';
        const cursorType = filled || selected || number !== '' ? 'cursor-pointer' : 'cursor';
        const className = `flex justify-center items-center w-8 h-8 border ${borderColor} hover:${hoverBorderColor} ${cursorType} select-none`;
        if (filled) {
            return (
                <div className={className} style={{ backgroundColor: color, color: Color.invertedHex(baseColor) }}>
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