import React from "react";

import RenderData from "@/scripts/renderData";
import Color from "@/scripts/colors";
import Pixel from "./Pixel";

interface StaticPixelProps {
    color: string;
}

function StaticPixel(props: StaticPixelProps) {
    const { color } = props;
    return (
        <div className="flex justify-center items-center w-8 h-8 cursor-none select-none" style={{ background: Color.darkenedHex(color, 50) }} />
    );
}

interface CompleteGridImageProps {
    height: number;
    width: number;
    dynPixels: JSX.Element[];
    staticPixels: JSX.Element[];
    timeStamp: string;
}

function CompleteGridImage(props: CompleteGridImageProps) {

    const [nReplaced, setNReplaced] = React.useState(0);

    const { height, width, dynPixels, staticPixels } = props;
    const rows = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            row.push(
                <div
                    key={`${x}`}
                >
                    {nReplaced <= index ? dynPixels[index] : staticPixels[index]}
                </div>
            );
        }
        rows.push(<div key={y} className="flex">{row}</div>);
    }

    if (nReplaced < width * height) {
        setTimeout(() => setNReplaced(nReplaced + 1), 1000 / (width * height));
    }

    return (
        <div className="relative">
            <div className="">
                {rows}
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-3 bg-gray-600 bg-opacity-90 rounded-md shadow-lg">
                <div className="text-gray-200 text-3xl">
                    Complete!
                </div>
                <div className="mt-3 text-gray-200 text-xl">
                    Time: {props.timeStamp}
                </div>
            </div>
        </div>
    );
}

export function getCompleteGridImage(renderData: RenderData, timeStamp: string) {
    const { height, width, pixels } = renderData;
    const dynPixels = pixels.map((pixel, i) => {
        return <Pixel key={`pix${i}`} props={pixel} />;
    });
    const staticPixels = pixels.map((pixel, i) => {
        return (
            <StaticPixel key={`stat${i}`} color={pixel.color} />
        );
    });

    return <CompleteGridImage height={height} width={width} dynPixels={dynPixels} staticPixels={staticPixels} timeStamp={timeStamp} />;
}