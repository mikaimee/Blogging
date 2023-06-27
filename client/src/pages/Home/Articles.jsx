import {toast} from 'react-hot-toast'
import {useQuery} from '@tanstack/react-query'
import { getAllPosts } from '../../services/posts'

import ArticleInfo from './ArticleInfo'

const Articles = () => {

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
                {!isLoading && !isError && data.map((post) => (
                    <ArticleInfo 
                        key={post._id}
                        post={post}
                    />
                ))}
            </div>
            <button>
                <span>More Articles</span>
            </button>
        </section>
    )
}

export default Articles