import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getSinglePost, updatePost } from '../services/posts'
import { toast } from 'react-hot-toast'
import jsonToHtml from '../utils/JsonToHtml'
import Layout from '../components/Layout'

const EditPost = () => {
    const {slug} = useParams()
    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)
    const [postData, setPostData] = useState(null);
    const [body, setBody] = useState(null)
    const [editedTitle, setEditedTitle] = useState('');
    const [editedSummary, setEditedSummary] = useState('');

    useEffect(() => {
        getSinglePost({slug})
            .then((data) => {
                setPostData(data)
                setEditedTitle(data.title)
                setEditedSummary(data.summary)
            })
            .catch((error) = {
                
            })
    }, [slug])


    const {
        mutate: mutateUpdatePost,
        isLoading: isLoadingUpdatePost
    } = useMutation({
        mutationFn: ({ updatedData, slug, token}) => {
            return updatePost({
                updatedData,
                slug,
                token
            })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["blog", slug])
            toast.success("Post has been updated")
        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    const updatePostHandler = (updatedData) => {
        mutateUpdatePost({
            updatedData, 
            slug: data.slug, 
            token: userState.userInfo.token
        })
    }    


    return (
        <Layout>
            <section className="container mx-auto px-5 py-10">
                <div className="w-full max-w-sm mx-auto">
                    <h1 className="font-roboto text-2xl font-bold text-center text-dark-hard mb-8">Edit Post</h1>
                    <form onSubmit={() => updatePostHandler}>
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
                        {/* <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="body" className="text-[#5a7184] font-semibold block">Body</label>
                            <EditorContent 
                                editor={editor}
                            />
                        </div> */}

                        {/* Cancel submission which will lead to the singlePost Page */}

                        <button
                            type='submit'

                        >
                            Update
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default EditPost