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
    }

    return (
        <section>
            <header>
                <Link to="/">
                    <h1>Blog</h1>
                </Link>
                <div>
                    {userState.userInfo ? (
                        <div>
                            <button onClick={() => navigate("/profile")}>Profile</button>
                            <button onClick={logoutHandler}>Logout</button>
                        </div>
                    ) 
                    : (
                        <button onClick={() => navigate("/login")}>Sign In</button>
                    )}
                </div>
            </header>
        </section>
    )
}

export default Header