import {useEffect} from 'react'
import Layout from '../components/Layout'
import ProfilePicture from '../components/ProfilePicture'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserProfile, updateProfile } from '../services/users/users'
import { userActions } from '../store/reducers/userReducers'
import toast from 'react-hot-toast'

const PASSWORD_VALID = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const EMAIL_VALID = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const ProfilePage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    const {
        data: profileData, 
        isLoading: profileIsLoading, 
        error: profileError
    } = useQuery({
        // function to be run when page loads
        queryFn: () => {
            return getUserProfile({token: userState?.userInfo?.token})
        },
        queryKey: ["profile"]
    })

    const {mutate, isLoading} = useMutation({
        mutationFn: ({username, password}) => {
            return updateProfile({
                token: userState.userInfo.token,
                userData: {username, password}
            })
        },
        onSuccess: (data) => {
            console.log(data)
            dispatch(userActions.setUserInfo(data))
            localStorage.setItem('account', JSON.stringify(data))
            queryClient.invalidateQueries(["profile"])
            toast.success("Profile is updated")

        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    // If already registered, go back to the home 
    useEffect(() => {
        if(!userState?.userInfo) {
            navigate("/")
        }
    }, [navigate, userState?.userInfo])

    const {
        register, 
        handleSubmit, 
        formState:{errors, isValid}
    } = useForm({
        defaultValues: {
            username: "",
            password: ""
        },
        values: {
            username: profileIsLoading ? "": profileData?.username,
        },
        mode: "onChange"
    })

    const submitHandler = (data) => {
        const {username, password} = data
        mutate({username, password})
    }

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
                            <label htmlFor="password">New Password (Optional)</label>
                            <input 
                                type='pasword'
                                id='password'
                                {...register("password")}
                                placeholder='Enter new password here'
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