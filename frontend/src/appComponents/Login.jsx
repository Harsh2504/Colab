import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserObj } from '../state/action';
function Login(props) {

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const change = () => {
    props.type("Signup");
  }
  const login = () => {
    axios.post('http://localhost:3000/api/auth/login', {
      email: email,
      password: password,
    })
      .then(response => {
        // console.log('Loged In', response.data);
        localStorage.setItem('auth-token',response.data.token);
        console.log(response.data.user);
        dispatch(setUserObj(response.data.user));
        navigate('/dashboard', { state: {}});
      })
      .catch(error => {
        console.error('Error sending email:', error);
      });
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  return (
    <div className='shadow-lg ml-4 border border-2 w-[500px] px-4 py-2 flex justify-center items-center flex-col h-[350px]'>
      <input type="text" className=' my-2 p-2 w-[400px] border rounded-[5px]' value={email} onChange={(event) => { setEmail(event.target.value) }} placeholder='Enter your email' />
      <input type="password" className='my-2 p-2 w-[400px] border rounded-[5px]' value={password} onChange={(event) => { setPassword(event.target.value) }} placeholder='Enter your password' />
      <button className="mb-3 p-[3px] relative mt-3 ">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
        <div onClick={login} className="px-8 py-2 bg-white rounded-full  relative group transition duration-200 text-black hover:bg-transparent hover:text-white ">
          Login
        </div>
      </button>
      <p className='' onClick={change}>Dont have account ? Register</p>
    </div>
  )
}

export default Login