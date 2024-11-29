import axios from "axios"
const fetchData = async (message: any) => {
    const payload = {
        url: message
    }
    try {
        const response = await axios.post("https://be-reelscribe.vercel.app/api/get_transcript", payload, {
            headers: {
                'Content-Type': 'application/json',  // Setting the content type
            },
        })

        console.log("Response:", response.data);
        return response.data
    } catch (error: any) {
         console.error("Error:", error.response ? error.response.data : error.message);
    }
};

export default fetchData