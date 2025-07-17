import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo } from '../userSlice';
import { updateUserAsync } from '../../user/userSlice';
import { useForm } from 'react-hook-form';


export default function UserProfile() {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const [selectedEditIndex, setSelectedEditIndex] = useState(-1)
  const [showAddAddressForm, setShowAddAddressForm] = useState(false)

  //TODO : we will add payment section when we work on backend.

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleEdit = (addressUpdate, index) => {
    const newUser = { ...userInfo, addresses: [...userInfo.addresses] } // for shallow copy issue
    newUser.addresses.splice(index, 1, addressUpdate);
    dispatch(updateUserAsync(newUser))
    setSelectedEditIndex(-1);
  }
  const handleRemove = (e, index) => {
    const newUser = { ...userInfo, addresses: [...userInfo.addresses] } // for shallow copy issue
    newUser.addresses.splice(index, 1);
    dispatch(updateUserAsync(newUser))
  }

  const handleAdd = (address) =>{
    const newUser = { ...userInfo, addresses: [...userInfo.addresses, address] } 
    dispatch(updateUserAsync(newUser))
    setShowAddAddressForm(false);
  }
  const handleEditForm = (index) => {
    setSelectedEditIndex(index);
    const address = userInfo.addresses[index]
    setValue('name', address.name)
    setValue('email', address.email)
    setValue('phone', address.phone)
    setValue('street', address.street)
    setValue('city', address.city)
    setValue('state', address.state)
    setValue('pinCode', address.pinCode)

  }

  return (
    <div>
      <div className="mx-auto mt-12 max-w-2xl  px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
            Name: {userInfo.name ? userInfo.name : 'New User'}</h1>
          <h3 className="text-xl my-5 font-bold tracking-tight text-red-900">
            email address : {userInfo.email} </h3>
            {userInfo.role === 'admin' && <h3 className="text-xl my-5 font-bold tracking-tight text-red-900">
            role : {userInfo.role} </h3>}

        </div>


        <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-white">
          <button
          onClick={e=>{setShowAddAddressForm(true);setSelectedEditIndex(-1)}}
            type="submit"
            className="rounded-md my-5 bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add New Address
          </button>

          {showAddAddressForm ? 
           (<form className='bg-white shadow px-5 mt-12 py-12' noValidate onSubmit={handleSubmit((data) => {
                console.log(data);
                handleAdd(data)
                reset();
              })} >
                <div className="space-y-12">
                  <div className="border-b border-gray-950/10 pb-12">
                    <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                          Full name
                        </label>
                        <div className="mt-2">
                          <input
                            id="name"
                            {...register('name', { required: 'name is required' })}
                            type="text"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>



                      <div className="sm:col-span-4">
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            {...register('email', { required: 'email is required' })}
                            type="email"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">
                          Phone
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                          <input
                            id="phone"
                            type="tel"
                            {...register('phone', { required: 'phone is required' })}
                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
                          Street address
                        </label>
                        <div className="mt-2">
                          <input
                            id="street"
                            {...register('street', { required: 'street-address is required' })}
                            type="text"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2 sm:col-start-1">
                        <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                          City
                        </label>
                        <div className="mt-2">
                          <input
                            id="city"
                            {...register('city', { required: 'city is required' })}
                            type="text"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="state" className="block text-sm/6 font-medium text-gray-900">
                          State / Province
                        </label>
                        <div className="mt-2">
                          <input
                            id="state"
                            {...register('state', { required: 'state is required' })}
                            type="text"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="pinCode" className="block text-sm/6 font-medium text-gray-900">
                          ZIP / Postal code
                        </label>
                        <div className="mt-2">
                          <input
                            id="pinCode"
                            {...register('pinCode', { required: 'pinCode is required' })}
                            type="text"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                 
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add Address
                    </button>
                  </div>

                </div>
              </form>) : null}
          <p className="mt-0.5 text-sm text-gray-500">Your Addresses : </p>
          {userInfo.addresses.map((address, index) => (
            <div>
              {selectedEditIndex === index ? (<form className='bg-white shadow px-5 mt-12 py-12' noValidate onSubmit={handleSubmit((data) => {
                console.log(data);
                handleEdit(data, index)
                reset();
              })} >
                <div className="space-y-12">
                  <div className="border-b border-gray-950/10 pb-12">
                    <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                          Full name
                        </label>
                        <div className="mt-2">
                          <input
                            id="name"
                            {...register('name', { required: 'name is required' })}
                            type="text"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>



                      <div className="sm:col-span-4">
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            {...register('email', { required: 'email is required' })}
                            type="email"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">
                          Phone
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                          <input
                            id="phone"
                            type="tel"
                            {...register('phone', { required: 'phone is required' })}
                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
                          Street address
                        </label>
                        <div className="mt-2">
                          <input
                            id="street"
                            {...register('street', { required: 'street-address is required' })}
                            type="text"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2 sm:col-start-1">
                        <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                          City
                        </label>
                        <div className="mt-2">
                          <input
                            id="city"
                            {...register('city', { required: 'city is required' })}
                            type="text"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="state" className="block text-sm/6 font-medium text-gray-900">
                          State / Province
                        </label>
                        <div className="mt-2">
                          <input
                            id="state"
                            {...register('state', { required: 'state is required' })}
                            type="text"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="pinCode" className="block text-sm/6 font-medium text-gray-900">
                          ZIP / Postal code
                        </label>
                        <div className="mt-2">
                          <input
                            id="pinCode"
                            {...register('pinCode', { required: 'pinCode is required' })}
                            type="text"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      onClick={e => setSelectedEditIndex(-1)}
                      type="submit"
                      className="rounded-md  px-3 py-2 text-sm font-semibold text-grey shadow-sm hover:bg-grey-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Edit Address
                    </button>
                  </div>

                </div>
              </form>) : null}
              <div className="flex justify-between px-5 gap-x-6 py-5 border-solid border-2 border-gray-200">

                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm/6 font-semibold text-gray-900">

                      {address.name}</p>
                    <p className="mt-1 truncate text-xs/5 text-gray-500">{address.street}</p>
                    <p className="mt-1 truncate text-xs/5 text-gray-500">{address.pinCode}</p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm/6 text-gray-900">Phone: {address.phone}</p>
                  <p className="text-sm/6 text-gray-500">{address.city}</p>

                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <button
                    onClick={(e) => handleEditForm(index)}
                    type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleRemove(e, index)}
                    type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Remove
                  </button>

                </div>
              </div>
            </div>

          ))}

        </div>
      </div>
    </div>
  );
}
