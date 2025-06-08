import React from 'react'
import LoginForm from '../clientComponents/LoginForm'
import UploadPage from '../clientComponents/UploadPage'

export default function Login() {
  return (
    <div className='bg-black w-screen h-screen flex justify-center items-center'>
        <div className='bg-white w-1/3 h-2/4 rounded-lg'>
          <LoginForm/>
        </div>
    </div>
  )
}
