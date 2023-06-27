import {useEffect} from 'react'
import Layout from '../components/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {useMutation} from '@tanstack/react-query'
import { signin } from '../services/users'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../store/reducers/userReducers'

const Login = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userState = useSelector(state => state.user)

    const {mutate, isLoading} = useMutation({
        mutationFn: ({username, password}) => {
            return signin({username, password})
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

    const {register, handleSubmit, formState:{errors, isValid}} = useForm({
        defaultValues: {
            username: "",
            password: ""
        },
        mode: "onChange"
    })

    const submitHandler = (data) => {
        const {username, password} = data
        mutate({username, password})
    }

    console.log(errors)

    return (
        <Layout>
            <section>
                <div>
                    <h1>Login</h1>
                    {/* Only will call submitHandler if handleSubmit does not have any error b/c it validates the data */}
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div>
                            <label htmlFor="username">Username</label>
                            <input 
                                type='text'
                                id='username'
                                {...register("username", {
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
                                    }
                                })}
                                placeholder='Enter password here'
                            />
                            {errors.password?.message && (
                                <p>{errors.password?.message}</p>
                            )}
                        </div>

                        <Link to="/forget-password">Forgot your password?</Link>
                        <Link to="/register">
                            <p>Need an account? </p>
                        </Link>
                        <button type='submit' disabled={!isValid || isLoading}>Login</button>
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default Login