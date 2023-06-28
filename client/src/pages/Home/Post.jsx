import {toast} from 'react-hot-toast'
import {useQuery} from '@tanstack/react-query'
import { getAllPosts } from '../../services/posts'

import PostInfo from './PostInfo'
import PostInfoSkeleton from '../../components/PostInfoSkeleton'
import ErrorMessage from '../../components/ErrorMessage'

const Posts = () => {

    const {data, isLoading, isError} = useQuery({
        queryFn: () => getAllPosts(),
        queryKey: ["posts"],
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    return (
        <section>
            <div>
                {!isLoading ? (
                    [...Array(3)].map((item, index) => (
                        <PostInfoSkeleton
                            key={index}
                            className=""
                        />
                    ))
                ): isError ? (
                    <ErrorMessage message="Cannot fetch data" />
                ) : (
                    data.map((post) => (
                        <PostInfo
                            key={post._id}
                            post={post}
                        />
                    ))
                )}
            </div>
            <button>
                <span>More Articles</span>
            </button>
        </section>
    )
}

export default Posts