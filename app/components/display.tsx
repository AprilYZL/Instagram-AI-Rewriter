'use client'

import { useEffect, useState } from 'react'

interface DisplaySectionProps {
    transcribedData: string
    rewrittenData: string
    setRewrittenData: (data: string) => void
    handleVideoGeneration: () => void
}

const DisplaySection = ({
    transcribedData,
    rewrittenData,
    setRewrittenData,
    handleVideoGeneration
}: DisplaySectionProps) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <div className="mt-4">
            {transcribedData && (
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Original Transcript:</h2>
                        <p className="whitespace-pre-wrap">{transcribedData}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Rewritten Transcript:</h2>
                        <textarea
                            value={rewrittenData}
                            onChange={(e) => setRewrittenData(e.target.value)}
                            className="w-full h-40 p-2 border rounded"
                        />
                    </div>
                    <button
                        onClick={handleVideoGeneration}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Generate Video
                    </button>
                </div>
            )}
        </div>
    )
}

export default DisplaySection
