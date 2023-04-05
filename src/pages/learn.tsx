import Link from "next/link";

import FlashingTitle from "@/components/FlashingTitle";
import { getRandomPalette } from "@/scripts/colors";
import FractalElem from "@/components/FractalElem";

export default function Tutorial() {
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="border border-gray-200 rounded-lg space-y-4 m-8 p-8 text-center bg-gray-100">
                <FlashingTitle text="FractalPixels!" flashInterval={500} colors={getRandomPalette()} size="2xl" />
                <FlashingTitle text="Tutorial" flashInterval={500} colors={getRandomPalette()} size="3xl" />
                <div className="text-left space-y-2 max-w-lg">
                    <p>The game&apos;s objective is to completely fill the grid with colored squares.</p>
                    <p>The grid contains numbered squares; you can create a block by clicking and dragging starting on one of those squares. For a correct solution, the size of each block should match the number that it contains. (The block will become colored when it has the correct size.)</p>
                    <p>If you make a mistake, you can click and drag to resize blocks or right click to remove a block.</p>
                    <p>Try out the small puzzle below to get started:</p>
                    <div className="flex justify-center py-4">
                        <FractalElem level="tutorial" />
                    </div>
                </div>
                <Link className="italic text-gray-600 hover:text-red-800 hover:font-bold" href="/">Back to menu</Link>
            </div>
        </div>
    );
}