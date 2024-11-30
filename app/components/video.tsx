'use client'

import { useState, useEffect } from 'react';
import Loading from './loading'
import { getVideoStatus } from '../services/generateVideo'

const VideoComponent = ({videoId}: {videoId: string}) => {

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const response = await getVideoStatus({id: videoId})
        console.log("videoStatus:", response)
        if (response.state === 'COMPLETE') {
          setData(response.url)
          console.log("videoUrl:", response)
          setIsLoading(false)
          clearInterval(intervalId)
        }
      } catch (err: any) {
        setIsLoading(false)
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    intervalId = setInterval(fetchData, 30000);
    fetchData();
    return () => clearInterval(intervalId);
  }, []);


  let content;
  if (error) {
    content = <p>Error: {error}</p>;
  } else if (data) {
    content = (
      <div className="max-w-[600px] h-auto mx-auto">
        <video width="100%" height="auto" controls>
          <source src={data} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  } else {
    content = <Loading />;
  }

  return <>{content}</>;
};

export default VideoComponent;