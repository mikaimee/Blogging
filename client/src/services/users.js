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

export const updateProfilePicture = async ({token, profilePicture}) => {
    try {
        // a new 'FormData' object is created
        const formData = new FormData()
        // profilePicture file is appended to the FormData object which associates the file with field name 'profilePicture'
        formData.append('profilePicture', profilePicture)

        // Created to specify the headers for the request
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }

        const { data } = await axios.patch("http://localhost:8000/user/profilePic",
            formData,
            config
        )
        return data
    }
    catch (error) {
        // error message is extracted from the response data, if it exists
        // If not, response data doesn't contain a message
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
    }
}

export const getAllUsers = async () => {
    try {
        const { data } = await axios.get('http://localhost:8000/user')
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const deleteUser = async ({_id, token}) => {
    try {
        const config = {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.delete('http://localhost:8000/user', config)
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}