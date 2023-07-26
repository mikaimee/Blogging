import axios from "axios";

// Accepts an object containing the necessary parameters: token, slug, body, parent, replyOnUser
export const newComment = async({token, slug, body, parent, replyOnUser}) => {
    try {
        // Holds the authorization header with provided token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const {data} = await axios.post('http://localhost:8000/comment', {
        body, 
        slug,
        parent,
        replyOnUser
        }, config)
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const editComment = async({token, body, commentId}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const {data} = await axios.patch(`http://localhost:8000/comment/${commentId}`, 
        { body }, config)
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const deleteComment = async({token, commentId}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const {data} = await axios.delete(`http://localhost:8000/comment/${commentId}`, config)
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}