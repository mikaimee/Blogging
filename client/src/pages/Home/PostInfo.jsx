import React from 'react'
import { Link } from 'react-router-dom'

const PostInfo = ({post}) => {
    return (
        <section>
            <div>
                {/* insert image here */}
                <div>
                    {/* title */}
                    <Link to={`/blog/${post.slug}`}>
                        <h3>{post.title}</h3>
                    </Link>
                    <p>{post.summary}</p>
                        <p>{post.user.username}</p>
                        <span>
                            {/* return date of month */}
                            {new Date(post.createdAt).getDate()}{" "} 
                            {new Date(post.createdAt).toLocaleDateString("default", {
                                month: "long"
                            })}
                        </span>
                </div>
            </div>
        </section>
    )
}

export default PostInfo