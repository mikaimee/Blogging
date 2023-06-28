import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSinglePost } from '../services/posts'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'

import { generateHTML } from '@tiptap/html'
import Bold from '@tiptap/extension-bold'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Italic from '@tiptap/extension-italic'
import Document from "@tiptap/extension-document";

const SinglePost = () => {

    const {slug} = useParams()
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
        <div>
            {/* <div>
                {data?.categories.map((category) => (
                    <Link to={`blog/category=${category.name}`}>
                        {category.name}
                    </Link>
                ))}
            </div> */}
            <div>
                <h1>{data?.title}</h1>
                <div>
                    {body}
                </div>
            </div>
        </div>
    )
}

export default SinglePost