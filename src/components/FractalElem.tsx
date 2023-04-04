import React from "react";

import { getRandomMandelProps, Mandelbrot } from "@/scripts/mandelbrot";
import GridImage from "./GridImage";

export const FractalElem: React.FC = () => {
    
    // wait for the window to load before rendering the fractal
    // other we get errors with hydration
    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
        setHydrated(true);
    });
    if (!hydrated) {
        return <div></div>;
    }

    const props = getRandomMandelProps();
    const mandelbrot = new Mandelbrot(props);
    const colorGrid = mandelbrot.paint();
    const colors = new Array(props.height * props.width);
    for (let i = 0; i < props.height; i++) {
        for (let j = 0; j < props.width; j++) {
            const color = colorGrid[i][j];
            colors[i * props.width + j] = color.toHex();
        }
    }
    return (
        <GridImage height={props.height} width={props.width} colors={colors} />
    )
}

export default FractalElem;