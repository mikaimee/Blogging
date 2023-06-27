import React from 'react'
import { Link } from 'react-router-dom'

const ArticleInfo = ({post}) => {
    return (
        <section>
            <div>
                {/* insert image here */}
                <div>
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

export default ArticleInfo