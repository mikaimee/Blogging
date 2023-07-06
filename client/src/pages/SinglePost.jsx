import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAllPosts, getSinglePost } from '../services/posts'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'
import CommentBox from '../components/comments/CommentBox'
import Layout from '../components/Layout'

import { generateHTML } from '@tiptap/html'
import Bold from '@tiptap/extension-bold'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Italic from '@tiptap/extension-italic'
import Document from "@tiptap/extension-document";

const SinglePost = () => {

    const {slug} = useParams()
    const userState = useSelector((state) =>state.user)
    const [body, setBody] = useState(null)

    const {data, isLoading, isError} = useQuery({
        queryFn: () => getSinglePost({slug}),
        queryKey: ["blog", slug],
        onSuccess: (data) => {
            console.log(data)
            setBody(
                parse(
                    generateHTML(data?.body, [
                        Bold,
                        Italic,
                        Text,
                        Paragraph,
                        Document
                    ])
                )
            )
        }
    })

    return (
        <Layout>
            <div className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
                {/* <div>
                    {data?.categories.map((category) => (
                        <Link to={`blog/category=${category.name}`}>
                            {category.name}
                        </Link>
                    ))}
                </div> */}
                <div>
                    <h1 className="text-xl font-medium font-roboto mt-4 text-dark-hard md:text-[26px]">{data?.title}</h1>
                    <div className="mt-4 prose prose-sm sm:prose-base">
                        {body}
                    </div>
                    <CommentBox 
                        comments = {data?.comments}
                        className="mt-10"
                        loggedInUserId = {userState?.userInfo?._id}
                        postSlug = {slug}
                    />
                </div>
            </div>
        </Layout>
    )
}

export default SinglePost