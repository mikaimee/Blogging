import React from 'react'
import { getAllUsers } from '../../services/users'
import {toast} from 'react-hot-toast'
import {useQuery} from '@tanstack/react-query'
import UserTableList from '../Admin/UserTableList'

const UserList = () => {

    const {data, isLoading, isError} = useQuery({
        queryFn: () => getAllUsers(),
        queryKey: ["users"],
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    return (
        <section className='flex flex-col continer mx-auto px-5 py-10 border-red-800'>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Admin</th>
                        <th>Number of Posts</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && !isError && data.map((user) => (
                        <UserTableList 
                            key={user._id}
                            user={user}
                        />
                    ))}
                </tbody>
            </table>
        </section>
    )
}

export default UserList