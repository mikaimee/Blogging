import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/actions/user';


const Header = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userState = useSelector(state => state.user)
    const [profileDropDown, setProfileDropDown] = useState(false)

    const logoutHandler = () => {
        dispatch(logout())
        navigate('/')
    }

    return (
        <section className="sticky top-0 left-0 right-0 z-50 bg-pink-200">
            <header className="container mx-auto px-5 flex justify-between py-4 items-center">
                <Link to="/">
                    <h1 className='font-roboto text-center text-8x1 font-bold text-dark-hard mb-10'>Blog</h1>
                </Link>
                <div>
                    {userState.userInfo ? (
                        <div className="text-white items-center gap-y-5 lg:text-dark-soft flex flex-col lg:flex-row gap-x-2 font-semibold">
                            {/* if the user is an Admin, get adminPage otherwise null */}
                            {userState.userInfo.isAdmin ? (
                                <button 
                                    type='button'
                                    className="mt-5 lg:mt-0 px-5 py-2 rounded-full text-pink-300 font-semibold hover:text-pink-400 transition-all duration-400"
                                    onClick={() => navigate("/admin")}
                                >
                                    Admin Page
                                </button>
                            ): null}
                            <button 
                                type='button'
                                className="mt-5 lg:mt-0 px-5 py-2 rounded-full text-pink-300 font-semibold hover:text-pink-400 transition-all duration-400"
                                onClick={() => navigate("/profile")}
                            >
                                Profile
                            </button>
                            <button 
                                type='button'
                                onClick={() => navigate("/newPost")}
                                className="mt-5 lg:mt-0 px-5 py-2 rounded-full text-pink-300 font-semibold hover:text-pink-400 transition-all duration-400"
                            >
                                New Post
                            </button>
                            <button 
                                type='button'
                                onClick={logoutHandler}
                                className="mt-5 lg:mt-0 px-5 py-2 rounded-full text-pink-300 font-semibold hover:text-pink-400 transition-all duration-400"
                            >
                                Logout
                            </button>
                        </div>
                    ) 
                    : (
                        <button 
                            onClick={() => navigate("/login")}
                            className="mt-5 lg:mt-0 px-5 py-2 rounded-full text-pink-300 font-semibold hover:text-pink-400 transition-all duration-400"
                            
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </header>
        </section>
    )
}

export default Header