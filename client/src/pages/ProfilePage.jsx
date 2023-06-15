import {useEffect} from 'react'
import Layout from '../components/Layout'
import ProfilePicture from '../components/ProfilePicture'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '../services/users/users'

const PASSWORD_VALID = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

const ProfilePage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userState = useSelector((state) => state.user)

    const {data: profileData, isLoading: profileIsLoading, error: profileError} = useQuery({
        // function to be run when page loads
        queryFn: () => {
            return getUserProfile({token: userState.userInfo.token})
        },
        queryKey: ["profile"]
    })

    // If already registered, go back to the home 
    useEffect(() => {
        if(!userState.userInfo) {
            navigate("/")
        }
    }, [navigate, userState.userInfo])

    const {register, handleSubmit, formState:{errors, isValid}} = useForm({
        defaultValues: {
            username: "",
            password: ""
        },
        values: {
            username: profileIsLoading ? "": profileData.username
        },
        mode: "onChange"
    })

    const submitHandler = (data) => {
        const {username, password} = data
    }

    console.log(errors)

    return (
        <Layout>
            <section>
                <div>
                    <ProfilePicture avatar={profileData?.avatar} />
                    {/* Only will call submitHandler if handleSubmit does not have any error b/c it validates the data */}
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div>
                            <label htmlFor="username">Username</label>
                            <input 
                                type='text'
                                id='username'
                                {...register("username", {
                                    minLength: {
                                        value: 3,
                                        message: "Username must be at least 3 characters"
                                    },
                                    required: {
                                        value: true,
                                        message: "Username is required"
                                    }
                                })}
                                placeholder='Enter username here'
                            />
                            {errors.username?.message && (
                                <p>{errors.username?.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <input 
                                type='pasword'
                                id='password'
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Password is required"
                                    },
                                    pattern: {
                                        value: PASSWORD_VALID,
                                        message: "Your password must be 8 24 characters and must include uppercase and lowercase letters, a number and a special character."
                                    }
                                })}
                                placeholder='Enter password here'
                            />
                            {errors.password?.message && (
                                <p>{errors.password?.message}</p>
                            )}
                        </div>
                        <button
                            type='submit'
                            disabled={!isValid || profileIsLoading}
                        >
                            Update
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default ProfilePage