import React from 'react'
import {deleteUser} from '../../services/users'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {toast} from 'react-hot-toast'
import { useSelector } from "react-redux";

const PostInfo = ({user, className}) => {

    const queryClient = useQueryClient();
    const userState = useSelector((state) => state.user)

    const {mutate: mutateDeleteUser, isLoading: isLoadingDeleteUser} = 
        useMutation({
            mutationFn: ({_id, token}) => {
                return deleteUser({
                    _id,
                    token
                })
            },
            onSuccess: (data) => {
                queryClient.invalidateQueries(["users"])
                toast.success("User has been deleted")
            },
            onError: (error) => {
                toast.error(error.message)
                console.log(error)
            }
        })
    
    const deleteHandler = ({_id, token}) => {
        mutateDeleteUser({_id, token})
    }

    return (
        <tr>
            <td>{user.username}</td>
            <td>{user.isAdmin ? (<p>Yes</p>) : (<p>No</p>)}</td>
            <td> # </td>
            <td>
                <button 
                    disabled={isLoadingDeleteUser}
                    type='button'
                    onClick={() => {
                        deleteHandler({
                            _id: user._id,
                            token: userState.userInfo.token
                        })
                    }}
                >
                    Delete
                </button>
            </td>
        </tr>
    )
}

export default PostInfo