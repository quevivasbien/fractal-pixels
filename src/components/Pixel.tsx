import React from "react";

import Color from "@/scripts/colors";
import type { PixelProps } from "@/scripts/renderData";


export default class Pixel extends React.Component<PixelProps, PixelProps> {
    state = { color: this.props.color, filled: this.props.filled, number: this.props.number };
    
    onClick = () => {
        // this.setState({ filled: !this.state.filled });
    }

    render() {
        const { color, filled, number } = this.state;
        const className = `flex justify-center items-center w-8 h-8 border border-gray-200 hover:border-gray-700 ${number !== '' ? 'cursor-pointer' : 'cursor'} select-none`;
        if (filled) {
            return (
                <div className={className} style={{ backgroundColor: color, color: Color.invertedHex(color) }}>
                    {number}
                </div>
            );
        }
        else {
            return (
                <div className={className} style={{ backgroundColor: "white", color: Color.darkenedHex(color, 0.3) }} onClick={this.onClick}>
                    {number}
                </div>
            );
        }
    }
}