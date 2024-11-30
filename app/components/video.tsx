'use client'

import { useState, useEffect } from 'react';
import Loading from './loading'
import { getVideoStatus } from '../services/generateVideo'

const VideoComponent = ({videoId}: {videoId: string}) => {

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getVideoStatus({id: videoId})
        console.log("videoStatus:", response)
        if (response?.url) {
          setData(response.url)
          clearInterval(intervalId)
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    intervalId = setInterval(fetchData, 30000);
    fetchData();
    return () => clearInterval(intervalId);
  }, []);

  if (!isLoading) return <Loading />;
  if (error) return <p>Error: {error}</p>;
  if (data) return (
    <div className="max-w-[600px] h-auto mx-auto">
      <video width="100%" height="auto" controls>
        <source src={data} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
  return <p>Waiting for data...</p>;
};

export default VideoComponent;