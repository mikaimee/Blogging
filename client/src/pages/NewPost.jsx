import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { createNewPost } from '../services/posts'
import toast from 'react-hot-toast'

const NewPost = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userState = useSelector(state => state.user)

    const {mutate, isLoading} = useMutation({
        mutationFn: ({token, title, summary, body, slug}) => {
            return createNewPost({token, title, summary, body, slug})
        },
        onSuccess: (data) => {
            console.log(data)
            toast.success("Successfully created new post")
        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    const {newPostCreate, handleSubmit, formState:{errors}} = useForm({
        defaultValues: {
            title: "",
            summary: "",
        },
        mode: "onChange"
    })

    const submitHandler = (data) => {
        const {token, title, summary, body, slug} = data
        mutate({
                token: userState.userInfo.token,
                title, 
                summary, 
                body, 
                slug
            })
    }

    console.log(errors)

    return (
        <Layout>
            <section className="container mx-auto px-5 py-10">
                <div className="w-full max-w-sm mx-auto">
                    <h1 className="font-roboto text-2xl font-bold text-center text-dark-hard mb-8">Create a new post</h1>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="title" className="text-[#5a7184] font-semibold block">Title</label>
                            <input
                                type='text'
                                id='title'
                                placeholder='Type title here'
                                className=''
                                // {...newPostCreate("title", {
                                //     minLength: {
                                //         value: 1,
                                //         message: "Title must be at least 1 characters"
                                //     },
                                //     required: {
                                //         value: true,
                                //         message: "Title is required"
                                //     }
                                // })}
                            />
                        </div>
                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="summary" className="text-[#5a7184] font-semibold block">Summary</label>
                            {/* <textarea 
                                rows="3"
                                placeholder='Leave comment here'
                                onChange={(e) => setValue(e.target.value)}
                            /> */}
                            <input
                                type='text'
                                id='summary'
                                placeholder='Type summary here'
                                className=''
                                // {...newPostCreate("summary", {
                                //     required: {
                                //         value: true,
                                //         message: "Summary is required"
                                //     }
                                // })}
                            />
                        </div>
                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="body" className="text-[#5a7184] font-semibold block">Body</label>
                            <input
                                type='text'
                                id='body'
                                placeholder='Type post here'
                                className=''
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