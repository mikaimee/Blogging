import React from 'react'
import { Link } from 'react-router-dom'

const PostInfo = ({post, className}) => {
    return (
        <div className={`rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] ${className}`}>
            {/* insert image here */}
            <div className="p-5">
                {/* title */}
                <Link to={`/blog/${post.slug}`}>
                    <h3 className="font-roboto font-bold text-xl text-dark-soft md:text-2xl lg:text-[28px]">{post.title}</h3>
                    <p className="text-dark-light mt-3 text-sm md:text-lg">{post.summary}</p>
                </Link>
                <div className='flex flex-col'>
                    <h4 className="font-bold italic text-dark-soft text-sm md:text-base">{post.user.username}</h4>
                </div>
                <span className="font-bold text-dark-light italic text-sm md:text-base">
                    {/* return date of month */}
                    {new Date(post.createdAt).getDate()}{" "} 
                    {new Date(post.createdAt).toLocaleDateString("default", {
                        month: "long"
                    })}
                </span>
            </div>
        </div>
    )
}

export default PostInfo