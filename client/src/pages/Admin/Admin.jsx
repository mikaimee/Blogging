import React from 'react'

import Layout from '../../components/Layout'
import UserList from './UserList'

const Admin = () => {
    return (
        <Layout>
            <div>Admin</div>
            <UserList />
        </Layout>
    )
}

export default Admin