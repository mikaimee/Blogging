import {useEffect} from 'react'
import Layout from '../components/Layout'
import ProfilePicture from '../components/ProfilePicture'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserProfile, updateProfile } from '../services/users'
import { userActions } from '../store/reducers/userReducers'
import toast from 'react-hot-toast'

const PASSWORD_VALID = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const EMAIL_VALID = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const ProfilePage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const userState = useSelector((state) => state.user);

    const {
        data,
        isLoading: profileIsLoading,
        error: profileError,
    } = useQuery({
        queryFn: () => {
        return getUserProfile({ token: userState?.userInfo?.token });
        },
        queryKey: ["profile"],
    });

    const { mutate, isLoading: updateProfileIsLoading } = useMutation({
        mutationFn: ({ username, password }) => {
        return updateProfile({
            token: userState.userInfo.token,
            userData: { username, password },
        });
        },
        onSuccess: (data) => {
        dispatch(userActions.setUserInfo(data));
        localStorage.setItem("account", JSON.stringify(data));
        queryClient.invalidateQueries(["profile"]);
        toast.success("Profile is updated");
        },
        onError: (error) => {
        toast.error(error.message);
        console.log(error);
        },
    });

    // If already registered, go back to the home 
    useEffect(() => {
        if (!userState.userInfo) {
        navigate("/");
        }
    }, [navigate, userState.userInfo]);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            username: "",
            password: ""
    },
    values: {
        username: profileIsLoading ? "" : data?.username
    },
    mode: "onChange",
    });

    const submitHandler = (data) => {
        const { username, password } = data;
        mutate({ username, password });
    };

    return (
        <Layout>
            <section>
                <div className="w-full max-w-sm mx-auto">
                    <ProfilePicture avatar={data?.avatar} />
                    {/* Only will call submitHandler if handleSubmit does not have any error b/c it validates the data */}
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="username" className="text-[#5a7184] font-semibold block">Username</label>
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
                                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${
                                    errors.username ? "border-red-500" : "border-[#c3cad9]"
                                }`}
                            />
                            {errors.username?.message && (
                                <p className="text-red-500 text-xs mt-1">{errors.username?.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="text-[#5a7184] font-semibold block">New Password (Optional)</label>
                            <input 
                                type='pasword'
                                id='password'
                                {...register("password")}
                                placeholder='Enter new password here'
                                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${
                                    errors.password ? "border-red-500" : "border-[#c3cad9]"
                                }`}
                            />
                            {errors.password?.message && (
                                <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
                            )}
                        </div>
                        <button
                            type='submit'
                            disabled={!isValid || profileIsLoading}
                            className="bg-primary text-black font-bold text-lg py-4 px-8 w-full rounded-lg mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
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