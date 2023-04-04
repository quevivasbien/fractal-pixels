// an indicator box that follows the mouse cursor

import React from 'react';

const X_OFFSET = 20;
const Y_OFFSET = 10;

function useMousePosition() {
    const [
        mousePosition,
        setMousePosition
    ] = React.useState({ x: 0, y: 0 });
    React.useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.pageX, y: e.pageY });
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);
    return mousePosition;
};

interface SizeIndicatorProps {
    width: number;
    height: number;
    size: number;
}

export default function SizeIndicator(props: SizeIndicatorProps) {
    const mousePosition = useMousePosition();
    const display = (mousePosition.x === 0 && mousePosition.y === 0) ? 'none' : 'block';
    return (
        <div
            style={{
                display: display,
                position: 'absolute',
                top: mousePosition.y + Y_OFFSET,
                left: mousePosition.x + X_OFFSET,
            }}

            className="bg-gray-100 border border-gray-400 rounded-md p-2"
        >
            {props.size}
        </div>
    );
}
