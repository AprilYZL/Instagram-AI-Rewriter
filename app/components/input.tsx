'use client'

import { useState } from 'react'
import Loading from './loading'
import Toggle from './toggle'
import VideoComponent from './video'
import fetchData from '../services/fetchData'
import { cleanInstagramUrl } from '../utils/index'
import { generateVideo } from '../services/generateVideo'

const fakeData = {
    "transcript": "If you're looking for a new couch, especially with Black Friday coming up, you absolutely need to check out United Canada. Their range is made in Canada and let me tell you, the quality speaks for itself. I have never felt more comfortable sofas in my life, plus the turnaround times quicker thanks to the local production. But wait, there's more. The warranty is 25 years. Tell me that's not the best deal you've come across. Every piece is highly customizable from the configuration, the material and the color and made with top quality materials. They're authorized retailers for renowned Canadian manufacturers that have been around for over decades like Palisader, Decorest and Marshall. They're open every day of the week with interiors designers in store to consult with. They currently have incredible Black Friday offers on. You could get this so far for your home for just $85 a month, so visit them in Richmond Hill in store or online.",
    "rewritten_transcript": "Hook: Hey there! Looking for a new couch this Black Friday? Well, I've got just the place for you!\n\nProblem: Choosing the perfect couch can be overwhelming with so many options out there. You want something comfortable, high quality, and customizable to fit your space.\n\nSolution: United Canada has got you covered! Their Canadian-made sofas are not only top quality but also highly customizable to suit your style and space.\n\nMore detail: With a 25-year warranty, quick turnaround time, and top-quality materials, United Canada offers the best deal in town. Plus, they work with renowned Canadian manufacturers like Palisader, Decorest, and Marshall to ensure you're getting the best of the best.\n\nCall to action: Don't miss out on their incredible Black Friday offers! Visit United Canada in store or online and find the perfect couch for your home today.",
}



const Input = () => {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isToggled, setIsToggled] = useState(false)
    const [transcribedData, setTranscribedData] = useState("")
    const [rewrittenData, setRewrittenData] = useState("")
    const [error, setError] = useState("")
    const [videoId, setVideoId] = useState("")
    const [videoStatus, setVideoStatus] = useState("")

    console.log(videoStatus)
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
    const downloadAsTxt = (data: string) => {
        const blob = new Blob([data], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'response.txt'
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setLoading(true)
        setVideoId("")
        if (message.trim() === '') return
        const cleanedUrl = cleanInstagramUrl(message)
        console.log(cleanedUrl)
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