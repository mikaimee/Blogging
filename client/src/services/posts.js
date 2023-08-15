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

// token parameter for authorization and likes + slug parameters to specify the data to be updated
export const updatePostLike = async({token, likes, likesCount, slug, userId}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const {data} = await axios.patch(`http://localhost:8000/post/${slug}/likes/${userId}`, {
            likes,
            likesCount
        }, config)
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const getUserPostCount = async (userId, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const {data} = await axios.get(`http://localhost:8000/post/user/${userId}/count`, config)
        return data.count
    }
    catch (error) {
        throw new Error(error.message)
    }
}

export const updatePost = async ({updatedData, slug, token}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const {data} = await axios.patch(`http://localhost:8000/post/${slug}`, updatedData, config)
        return data
    }
    catch (error) {
        throw new Error(error.message)
    }
}