'use client'

import { useState, useEffect } from 'react'
import Loading from '../components/loading'
import Toggle from '../components/toggle'
import VideoComponent from '../components/video'
import fetchData from '../services/fetchData'
import Input from '../components/input'
import DisplaySection from '../components/display'
import { cleanInstagramUrl, downloadAsTxt } from '../utils/index'
import { generateVideo } from '../services/generateVideo'

const AIGenerator = () => {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isToggled, setIsToggled] = useState(false)
    const [transcribedData, setTranscribedData] = useState("")
    const [rewrittenData, setRewrittenData] = useState("")
    const [error, setError] = useState("")
    const [videoId, setVideoId] = useState("")
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleVideoGeneration = async () => {
        setError("")
        if (rewrittenData.trim() === '') return
        if (rewrittenData.length > 799) {
            setError('Script is too long. Please shorten it to 800 characters or less.')
            return
        }
        try {
            const responseClient = await generateVideo({ script: rewrittenData })
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
            return
        }
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

    if (!isMounted) {
        return null
    }

    return (
        <div>
            <Input message={message} setMessage={setMessage} handleSubmit={handleSubmit} setError={setError} />
            <div>
                <Toggle
                    enabledText="Download as txt"
                    disabledText='Do not download'
                    isToggled={isToggled}
                    setIsToggled={setIsToggled}
                />

                {error && <div className="text-red-500">{error}</div>}
                {loading ? (
                    <Loading />
                ) : (
                    <DisplaySection 
                        transcribedData={transcribedData} 
                        rewrittenData={rewrittenData} 
                        setRewrittenData={setRewrittenData} 
                        handleVideoGeneration={handleVideoGeneration} 
                    />
                )}
            </div>
            <div className="max-w-4xl mx-auto mt-8">
                {videoId && <VideoComponent videoId={videoId} />}
            </div>
        </div>
    )
}

export default AIGenerator