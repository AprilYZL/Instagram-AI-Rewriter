"use client"
import { handlePaste } from '../utils/index'

const Input = ({ message, setMessage, handleSubmit, setError }: { message: string, setMessage: (value: string) => void, handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void, setError: (value: string) => void }) => {

    return (
        <form onSubmit={handleSubmit} className="w-full bg-[#1e1e1e]">
            <div className="relative flex items-center max-w-4xl mx-auto">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Paste your URL here..."
                    className="w-full rounded-lg bg-[#2d2d2d] px-4 py-3 pr-[140px] text-white placeholder-gray-400 focus:outline-none"
                />
                <div className="absolute right-2 flex items-center space-x-2 bg-[#2d2d2d]">
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-300" onClick={()=>handlePaste(setMessage, setError)}>
                        Paste
                    </button>
                    <button type="submit" className="p-2 text-gray-400 hover:text-gray-300">
                        Submit
                    </button>
                </div>
            </div>
        </form>
    )
}

export default Input
