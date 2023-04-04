import { useRouter } from 'next/router';

import FractalElem from '@/components/FractalElem';

export default function GameScreen()  {
    const router = useRouter();
    const { level } = router.query;
    if (typeof level !== 'string') {
        return <div></div>;
    }

    return (
      <div className="flex justify-center items-center p-4">
        <FractalElem level={level} />
      </div>
    )
  }