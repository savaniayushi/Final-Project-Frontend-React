import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUserAsync, selectError, selectLoggedInUser } from '../authSlice';


export default function Login() {
  // const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const error = useSelector(selectError)
  const user = useSelector(selectLoggedInUser)
   const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
  
    console.log(errors)
    console.log(user);
    

  return (
    <>
     {user && <Navigate to="/" replace={true}></Navigate>}
       <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/ecommerce.png"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form noValidate className="space-y-6" onSubmit={handleSubmit((data)=>{
               dispatch(loginUserAsync({email:data.email, password:data.password}))
                    //  console.log(data);
                     
                   })} >
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
              <input
                  id="email"
                 {...register("email", { required: "email is required",pattern:{value:/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,message:'email is not valid'} })}
                  type="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
         {errors.email && <p className='text-red-500'>{errors.email.message}</p>}

              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
              <input
                  id="password"
                  {...register("password",  { required: "password is required", })}
                  type="password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
               {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
              </div>
              {error && <p className='text-red-500'>{error || error.message}</p>}

            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
      
    </>
  )
}
  
