import axios from "axios";

export const newComment = async({token, slug, body, parent, replyOnUser}) => {
    try {
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
        const {data} = await axios.patch(`http://localhost:8000/comment/${commentId}`, {
        body
        }, config)
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