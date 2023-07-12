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

export const getSinglePost = async ({slug}) => {
    try {
        const {data} = await axios.get(`http://localhost:8000/post/${slug}`)
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const createNewPost = async({token, title, summary, body, slug}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const {data} = await axios.post('http://localhost:8000/post', {
        title, 
        summary,
        body,
        slug,
        }, config)
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const deletePost = async ({slug, token}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const {data} = await axios.delete(`http://localhost:8000/post/${slug}`, config)
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}