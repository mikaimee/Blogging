import axios from 'axios'

export const getAllPosts = async () => {
    try {
        const { data } = await axios.get('http://localhost:8000/post')
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}