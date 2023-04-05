import React from "react";
import { useRouter } from "next/router";

export default function SelectPuzzle() {

    const [buttonEnabled, setButtonEnabled] = React.useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const value = form.levelSelect.value;
        router.push(`/game/${value}`);
    }

    return (
        <div>
            <div className="text-gray-600">Select a difficulty:</div>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-x-4">
                    <label className="space-x-2" onClick={() => setButtonEnabled(true)}>
                        <input type="radio" name="levelSelect" value="easy" />
                        <span>Easy</span>
                    </label>
                    <label className="space-x-2" onClick={() => setButtonEnabled(true)}>
                        <input type="radio" name="levelSelect" value="medium" />
                        <span>Medium</span>
                    </label>
                    <label className="space-x-2" onClick={() => setButtonEnabled(true)}>
                        <input type="radio" name="levelSelect" value="hard" />
                        <span>Hard</span>
                    </label>
                    <label className="space-x-2" onClick={() => setButtonEnabled(true)}>
                        <input type="radio" name="levelSelect" value="expert" />
                        <span>Expert</span>
                    </label>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-transform duration-300 disabled:opacity-25 disabled:bg-blue-500" type="submit" disabled={!buttonEnabled}>
                    Play &#8594;
                </button>
            </form>
        </div>
    )
}