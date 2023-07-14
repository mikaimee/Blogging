import React, { useState } from "react";
import { HiOutlineCamera } from "react-icons/hi";

import stables from '../constants/stables'
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateProfilePicture } from '../services/users';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userActions } from "../store/reducers/userReducers";

const ProfilePicture = ({ avatar }) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const userState = useSelector((state) => state.user);
    const [profilePic, setProfilePic] = useState(null)

    const {mutate} = useMutation(updateProfilePicture, {
        onSuccess: (data) => {
            // update user information in Redux store
            dispatch(userActions.setUserInfo(data))
            // store updated user information in the local storage
            localStorage.setItem("account", JSON.stringify(data))
            // Invalidate profile query in the query client to trigger refetch
            queryClient.invalidateQueries(["profile"])
            toast.success("Profile Photo is removed")
        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        // store selected file object and its URL
        setProfilePic({ url: URL.createObjectURL(file), file})
        // ensure that state update is processed in the next event loop iteration
        // By wrapping the mutate function with a delay of '0, allow the onfoing event loop to complete before executing the code
        // Helps with "disconnected port object" error
        setTimeout(() => {
            const formData = new FormData()
            formData.append("profilePicture", file)
            mutate({ token: userState.userInfo.token, formData})
        }, 0)
    }

    const handleDeletePic = () => {
        // Showing confirmation dialog to confirm the deletion
        if (window.confirm("Do you want to deleteyour profile picture")) {
            try {
                const formData = new FormData()
                formData.append("profilePicture", undefined)
                mutate({token: userState.userInfo.token})
            }
            catch(error) {
                toast.error(error.message)
                console.log(error)
            }
        }
    }


    return (
        <div>
            <div>
                <label htmlFor="profilePicture">
                    {avatar ? (
                        <img 
                            src={stables.UPLOAD_FOLDER_VASE_URL + avatar} 
                            alt="Profile Picture"
                        />
                    ) : (
                        <div>
                            <HiOutlineCamera />
                        </div>
                    )}
                </label>
                <input 
                    type="file" 
                    id="profilePicture"
                    onChange={handleFileChange}
                />
            </div>
            <button
                onClick={handleDeletePic}
                type="button"
                
            >
                Delete Image
            </button>
        </div>
    )
}

export default ProfilePicture