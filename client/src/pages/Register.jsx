import {useEffect} from 'react'
import Layout from '../components/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {useMutation} from '@tanstack/react-query'
import { signup } from '../services/users'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../store/reducers/userReducers'

const PASSWORD_VALID = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

const Register = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userState = useSelector(state => state.user)

    const {mutate, isLoading} = useMutation({
        mutationFn: ({username, password}) => {
            return signup({username, password})
        },
        onSuccess: (data) => {
            console.log(data)
            dispatch(userActions.setUserInfo(data))
            localStorage.setItem('account', JSON.stringify(data))

        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    // If already registered, go back to the home page 
    useEffect(() => {
        if(userState.userInfo) {
            navigate("/")
        }
    }, [navigate, userState.userInfo])

    const {register, handleSubmit, formState:{errors, isValid}, watch} = useForm({
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: ""
        },
        mode: "onChange"
    })

    const submitHandler = (data) => {
        const {username, password} = data
        mutate({username, password})
    }

    const password = watch('password')

    console.log(errors)

    return (
        <Layout>
            <section>
                <div>
                    <h1>Register</h1>
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

                        <div>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input 
                                type='password'
                                id='confirmPassword'
                                {...register("confirmPassword", {
                                    required: {
                                        value: true,
                                        message: "Confirm Password is required"
                                    },
                                    // value is what is inputted and password is the watch
                                    validate: (value) => {
                                        if (value !== password) {
                                            return "Passwords do not match"
                                        }
                                    }
                                })}
                                placeholder='Enter Confirm Password'
                            />
                            {errors.confirmPassword?.message && (
                                <p>{errors.confirmPassword?.message}</p>
                            )}
                        </div>

                        <Link to="/login">
                            <p>Already have an account? </p>
                        </Link>
                        <button type='submit' disabled={!isValid || isLoading}>Register</button>
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default Register