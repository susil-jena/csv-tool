"use client"
import React, { useState } from 'react'
import axios from 'axios';
import { useAppDispatch } from '../redux/index';
import { addToken } from '../redux/reducers/authSlice';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [loginPage, setLoginPage] = useState(true);
    const [password, setPassword] = useState('');
    const [conformPassword, setConformPassword] = useState('');
    const dispatch = useAppDispatch();
    const router = useRouter()
    const submitLoginForm = async () => {
        try {
            const response :any = await axios.post( process.env.NEXT_PUBLIC_BACKEND_URL +'/api/auth/login', {
                email: email,
                password: password
            })
            console.log(response)
            if (response.status === 200) {
                dispatch(addToken(response.data));
                localStorage.setItem('user', JSON.stringify(response.data))
                router.push('/home');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }

    }
    const submitRegisterForm = async () => {
        if (password === conformPassword) {
            try {
                const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL +'/api/auth/register', {
                email: email,
                password: password
            })
            if (response.status === 200) {
                dispatch(addToken(response.data));
                localStorage.setItem('user', JSON.stringify(response.data))
                router.push('/home');
            }
                
            } catch (error : any) {
                toast.error(error?.message)
            }
            
        }
        
    }

    return (
        <>
            {
                loginPage ? (
                    <div className='flex flex-col justify-center items-center h-full gap-7'>
                        <span className=' text-[2rem] font-serif'>Login</span>
                        <div className='flex flex-col w-[50%] gap-1'>
                            <input
                                className='border-[2px] border-black rounded-2xl h-[2.5rem] px-3'
                                type="text"
                                name="email"
                                placeholder='Email Address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email" />
                        </div>
                        <div className='flex flex-col w-[50%] gap-1'>
                            <input
                                className='border-[2px] border-black rounded-2xl h-[2.5rem] px-3'
                                type="password"
                                name="password"
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password" />
                        </div>
                        <button
                            type="submit"
                            className='bg-black w-[35%] h-[2.5rem] rounded-2xl text-white'
                            onClick={submitLoginForm}
                        >Login</button>
                        <div className='text-[12px] underline hover:cursor-pointer text-black'
                            onClick={() => setLoginPage(false)}
                        >
                            New user? Register Here.
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col justify-center items-center h-full gap-7'>
                        <span className=' text-[2rem] font-serif'>Register</span>
                        <div className='flex flex-col w-[50%] gap-1'>
                            <input
                                className='border-[2px] border-black rounded-2xl h-[2.5rem] px-3'
                                type="text"
                                name="email"
                                placeholder='Email Address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email" />
                        </div>
                        <div className='flex flex-col w-[50%] gap-1'>
                            <input
                                className='border-[2px] border-black rounded-2xl h-[2.5rem] px-3'
                                type="password"
                                name="password"
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password" />
                        </div>
                        <div className='flex flex-col w-[50%] gap-1'>
                            <input
                                className='border-[2px] border-black rounded-2xl h-[2.5rem] px-3'
                                type="password"
                                name="Conform password"
                                placeholder='Conform Password'
                                value={conformPassword}
                                onChange={(e) => setConformPassword(e.target.value)}
                                id="password" />
                        </div>
                        <button
                            type="submit"
                            className='bg-black w-[35%] h-[2.5rem] rounded-2xl text-white'
                            onClick={submitRegisterForm}
                        >Register</button>
                        <div className='text-[12px] underline hover:cursor-pointer text-black'
                            onClick={() => setLoginPage(true)}
                        >
                            Already Registered? Login Here.
                        </div>
                    </div>
                )
            }

        </>

    )
}
