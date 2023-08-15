import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { createNewPost } from '../services/posts'
import toast from 'react-hot-toast'

import {EditorContent, useEditor} from '@tiptap/react' 
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'

const NewPost = () => {

    const navigate = useNavigate()
    const userState = useSelector((state) => state.user)

    const {mutate: createPost, isLoading} = useMutation({
        mutationFn: ({token, title, summary, body, slug}) => {
            return createNewPost({token, title, summary, body, slug})
        },
        onSuccess: (data) => {
            console.log(data)
            toast.success("Successfully created new post")
            navigate("/")
        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')

    const editor = useEditor({
        extensions: [Document, Heading, Paragraph, Text, Bold], 
    });

    const submitHandler = (e) => {
        e.preventDefault()
        if (!title || !summary || !editor) {
            toast.error('Please fill in all required fields')
            return
        }

        const token = userState.userInfo.token
        const editorContent = editor.getJSON()
        const body = {
            type: 'doc',
            content: editorContent,
        };

        console.log('Editor Content: ', editorContent)

        createPost({
            token,
            title,
            summary,
            body
        })
    }

    return (
        <Layout>
            <section className="container mx-auto px-5 py-10">
                <div className="w-full max-w-sm mx-auto">
                    <h1 className="font-roboto text-2xl font-bold text-center text-dark-hard mb-8">Create a new post</h1>
                    <form onSubmit={submitHandler}>
                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="title" className="text-[#5a7184] font-semibold block">Title</label>
                            <input
                                type='text'
                                id='title'
                                placeholder='Type title here'
                                className=''
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />
                        </div>
                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="summary" className="text-[#5a7184] font-semibold block">Summary</label>
                            <input
                                type='text'
                                id='summary'
                                placeholder='Type summary here'
                                className=''
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="body" className="text-[#5a7184] font-semibold block">Body</label>
                            <EditorContent 
                                editor={editor}
                            />
                        </div>

                        <Link to="/">
                            <p>Go back home</p>
                        </Link>

                        <button
                            type='submit'
                            disabled={isLoading}
                        >
                            Post
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default NewPost