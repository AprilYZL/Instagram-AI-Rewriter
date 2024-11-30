'use client'

import { useState } from 'react'
import Loading from './loading'
import Toggle from './toggle'
import VideoComponent from './video'
import fetchData from '../services/fetchData'
import { cleanInstagramUrl, downloadAsTxt } from '../utils/index'
import { generateVideo } from '../services/generateVideo'

const Input = () => {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isToggled, setIsToggled] = useState(false)
    const [transcribedData, setTranscribedData] = useState("")
    const [rewrittenData, setRewrittenData] = useState("")
    const [error, setError] = useState("")
    const [videoId, setVideoId] = useState("")

    const handleVideoGeneration = async () => {
        setError("")
        if (rewrittenData.trim() === '') return
        if (rewrittenData.length > 799) {
            setError('Script is too long. Please shorten it to 800 characters or less.')
            return
        }
        try {
            const responseClient = await generateVideo({script: rewrittenData})
            setVideoId(responseClient?.operationId)
        } catch (error) {
            setError('An error occurred while fetching the data.')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setLoading(true)
        setVideoId("")
        if (message.trim() === '') return
        const cleanedUrl = cleanInstagramUrl(message)
        if (!cleanedUrl) { 
            setError('Invalid Instagram reel URL');
            setLoading(false)
            return }
        try {
            const responseClient = await fetchData(cleanedUrl)
            //const responseClient = fakeData
            setTranscribedData(responseClient?.transcript)
            setRewrittenData(responseClient?.rewritten_transcript)
            if (isToggled) downloadAsTxt(responseClient?.transcript)

        } catch (error) {
            setError('An error occurred while fetching the data.')
        }
        setLoading(false)

    }

    const handlePaste = async () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                const text = await navigator.clipboard.readText()
                setMessage(text)
            } catch (err) {
                console.error('Failed to read clipboard contents: ', err)
                setError('Failed to access clipboard.')
            }
        } else {
            alert('Clipboard not supported in this browser.')
        }
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className=" w-full bg-[#1e1e1e]"
            >
                <div className="relative flex items-center max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Paste your url here..."
                        className="w-full rounded-lg bg-[#2d2d2d] px-4 py-3 pr-[140px]
                        text-white placeholder-gray-400 focus:outline-none"
                    />
                    <div className="absolute right-2 flex items-center space-x-2 bg-[#2d2d2d]" >
                        <button
                            type="button"
                            className="p-2 text-gray-400 hover:text-gray-300 transition bg-[#2d2d2d]"
                            onClick={handlePaste}
                        >
                            Paste
                        </button>
                        <button
                            type="submit"
                            className="p-2 text-gray-400 hover:text-gray-300 transition bg-[#2d2d2d]"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
            <div>
                <Toggle
                    enabledText="Download as txt"
                    disabledText='Do not download'
                    isToggled={isToggled}
                    setIsToggled={setIsToggled}
                />
                <div className="max-w-4xl mx-auto mt-8">
                    {error && <div className="text-red-500">{error}</div>}
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {transcribedData && (
                                <div className="text-white border p-4 rounded bg-gray-800">
                                    <h3 className="font-bold mb-2">Transcribed Data</h3>
                                    <p>{transcribedData}</p>
                                </div>
                            )}
                            {rewrittenData !== undefined && rewrittenData?.length > 0 && (
                                <div className="text-white border p-4 rounded bg-gray-800">
                                    <h3 className="font-bold mb-2">Rewritten Data</h3>
                                    <textarea
                                        className="w-full h-80 p-2 bg-gray-700 text-white rounded resize-none"
                                        value={rewrittenData}
                                        onChange={(e) => setRewrittenData(e.target.value)}
                                    />
                                    <button
                                        className="mt-4 bg-[#2d2d2d] text-white px-4 py-2 rounded hover:text-gray-400"
                                        onClick={handleVideoGeneration}
                                    >
                                        Generate AI Video
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
            <div className="max-w-4xl mx-auto mt-8">
                {videoId && <VideoComponent videoId={videoId} />}
            </div>
            
        </div>
    )
}

export default Input