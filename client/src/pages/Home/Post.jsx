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
        <section className='flex flex-col continer mx-auto px-5 py-10 border-red-800'>
            <div className=" flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
                {!isLoading && !isError && data.map((post) => (
                    <PostInfo
                        key={post._id}
                        post={post}
                        className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
                    />
                ))}
            </div>
            <button className="mx-auto flex items-center gap-x-2 font-bold text-primary border-2 border-primary px-6 py-3 rounded-lg">
                <span>More Articles</span>
            </button>
        </section>
    )
}

export default Posts