import FlashingTitle from "@/components/FlashingTitle";
import SelectPuzzle from "@/components/SelectPuzzle";
import { getRandomPalette } from "@/scripts/colors";
import Link from "next/link";

export default function StartScreen()  {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="border border-gray-200 rounded-lg space-y-4 p-8 text-center bg-gray-100">
        <FlashingTitle text="FractalPixels!" flashInterval={500} colors={getRandomPalette()} />
        <SelectPuzzle />
        <div className="pt-4">
          <Link className="italic text-gray-600 hover:text-red-800 hover:font-bold" href="/learn">Learn to play</Link>
        </div>
      </div>
    </div>
  )
}