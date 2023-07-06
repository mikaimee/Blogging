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
            <section className="container mx-auto px-5 py-10">
                <div className="w-full max-w-sm mx-auto">
                    <h1 className="font-roboto text-2xl font-bold text-center text-dark-hard mb-8">Login</h1>
                    {/* Only will call submitHandler if handleSubmit does not have any error b/c it validates the data */}
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="username" className="text-[#5a7184] font-semibold block">Username</label>
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
                                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${
                                    errors.username ? "border-red-500" : "border-[#c3cad9]"
                                }`}
                            />
                            {errors.username?.message && (
                                <p>{errors.username?.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="password" className="text-[#5a7184] font-semibold block">Password</label>
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
                                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${
                                    errors.password ? "border-red-500" : "border-[#c3cad9]"
                                }`}
                            />
                            {errors.password?.message && (
                                <p>{errors.password?.message}</p>
                            )}
                        </div>

                        <Link to="/forget-password" className="text-sm font-semibold text-primary">Forgot your password?</Link>
                        <Link to="/register" className="text-primary">
                            <p>Need an account? </p>
                        </Link>
                        <button type='submit' disabled={!isValid || isLoading} className="mt-5 lg:mt-0 border-2 border-blue-500 px-6 py-2 rounded-full text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300">Login</button>
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default Login