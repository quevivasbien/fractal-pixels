import FractalElem from "../components/FractalElem";

const width = 20;

export default function MyApp()  {
  return (
    <div className="flex justify-center items-center p-4">
      <FractalElem x0={-2} y0={-1.5} width={width} height={width} pixelSize={3/width} maxIter={100} />
    </div>
  )
}