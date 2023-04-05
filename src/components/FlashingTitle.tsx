import React from "react";

import Color from "@/scripts/colors";

interface FlashingTitleProps {
    text: string;
    colors: Color[];
    flashInterval: number;  // interval in ms between color changes
    size: string; // text size, e.g. "3xl"
}

export default function FlashingTitle(props: FlashingTitleProps) {
    
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);

    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
        setHydrated(true);
    }, []);
    if (!hydrated) {
        return <div className="text-3l">
            {props.text}
        </div>;
    }

    const {text, colors} = props;
    const chars = [];
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const color = colors[(currentIndex + i) % colors.length].darkened(30, 10).toHex();
        chars.push(
            <span key={i} style={{ color: color }}>
                {char}
            </span>
        );
    }

    // shift colors after flashInterval ms
    setTimeout(() => { setCurrentIndex((currentIndex + 1) % colors.length) }, props.flashInterval);
    
    return (
        <div className={`text-${props.size}`}>
            {chars}
        </div>
    )
}