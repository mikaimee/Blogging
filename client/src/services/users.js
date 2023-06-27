import axios from 'axios'

export const signup = async({username, password}) => {
    try {
        const { data } = await axios.post('http://localhost:8000/auth/register', {
        username,
        password
        })
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const signin = async({username, password}) => {
    try {
        const {data} = await axios.post('http://localhost:8000/auth/login', {
        username, 
        password
        })
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const getUserProfile = async ({ token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.get("http://localhost:8000/user/profile", config);
        return data;
    } 
    catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const updateProfile = async ({ token, userData }) => {
    try {
        const config = {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.patch(
        "http://localhost:8000/user",
        userData,
        config
        );
        return data;
    } 
    catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};