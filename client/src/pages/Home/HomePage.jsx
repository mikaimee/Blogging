import React from 'react'
import Layout from '../../components/Layout'
import Posts from './Post'
import Search from './Search'

const HomePage = () => {
    return (
        <Layout>
            <div>HomePage</div>
            <Search />
            <Posts />
        </Layout>
    )
}

export default HomePage