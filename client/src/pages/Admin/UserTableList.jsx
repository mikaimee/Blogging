import React, { useEffect, useState } from 'react'
import {deleteUser} from '../../services/users'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {toast} from 'react-hot-toast'
import { useSelector } from "react-redux";
import { getUserPostCount } from '../../services/posts';

const UserTableList = ({user, className}) => {

    const queryClient = useQueryClient();
    const userState = useSelector((state) => state.user)
    const [postCount, setPostCount] = useState(0)

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

    useEffect(() => {
        const fetchPostCount = async () => {
            try {
                const userId = user._id
                const count = await getUserPostCount(userId, userState.userInfo.token)
                setPostCount(count)
            }
            catch(error) {
                toast.error(error.message)
                setPostCount(0)
            }
        }
        fetchPostCount()
    }, [user._id, userState.userInfo.token])

    return (
        <tr>
            <td>{user.username}</td>
            <td>{user.isAdmin ? (<p>Yes</p>) : (<p>No</p>)}</td>
            <td> 
                <p>{postCount}</p>
            </td>
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

export default UserTableList