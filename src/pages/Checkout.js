import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItemFromCartAsync, selectItems, updateCartAsync } from '../features/cart/cartSlice';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {  updateUserAsync } from '../features/user/userSlice'
import { handler } from '@tailwindcss/aspect-ratio';
import { createOrderAsync, selectCurrentOrder } from '../features/order/orderSlice';
import { discountedPrice } from '../app/constants';
import {selectUserInfo} from '../features/user/userSlice'


// import { useState } from 'react'
const products = [
  {
    id: 1,
    name: 'Throwback Hip Bag',
    href: '#',
    color: 'Salmon',
    price: '$90.00',
    quantity: 1,
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
    imageAlt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.',
  },
  {
    id: 2,
    name: 'Medium Stuff Satchel',
    href: '#',
    color: 'Blue',
    price: '$32.00',
    quantity: 1,
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
  },
  // More products...
]

function Checkout() {
    const [open, setOpen] = useState(true)
    const dispatch = useDispatch();
    const items = useSelector(selectItems);
    const user = useSelector(selectUserInfo)
    const currentOrder= useSelector(selectCurrentOrder)
    const totalAmount = items.reduce((amount, item)=>discountedPrice(item.product) * item.quantity + amount,0)
    const totalItems = items.reduce((total, item)=>item.quantity + total,0)
   const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm();

      console.log(currentOrder);
      
      const [selectedAddress, setSelectedAddress] = useState(null);
      const [paymentMethod, setPaymentMethod] = useState('cash');
    const handleQuantity = (e,item)=>{
    dispatch(updateCartAsync({id: item.id, quantity: +e.target.value}))
    }
  
    console.log(selectedAddress);
    
    const handleRemove = (e,id)=>{
      dispatch(deleteItemFromCartAsync(id))
    }
    const handleAddress = (e)=>{
      // console.log(e.target.value)
      setSelectedAddress(user.addresses[e.target.value]);
    }
    const handlePayment = (e)=>{
      console.log(e.target.value)
     setPaymentMethod(e.target.value)
    };

    const handleOrder = (e)=>{
      if(selectedAddress && paymentMethod){
      const order = {items, totalAmount, totalItems, 
        user:user.id, paymentMethod, selectedAddress, 
        status:'pending' // other status can be delivered, received.
      };
  
    dispatch(createOrderAsync(order));
       // need to redirect from here to a new page of order success
   } else {
    //TODO: we can use proper messaging popup here 
      alert('Enter Address and Payment method')
    }
     //TODO: redirect to order-success page
    //TODO: clear cart after order
    //TODO: on server change the stock number of items
  
  };

   

    return(
     <>
         {!items.length && <Navigate to="/" replace={true}></Navigate>}
         {currentOrder && currentOrder.paymentMethod ==='cash' && (<Navigate to={`/order-success/${currentOrder.id}`} 
         replace={true}></Navigate>)}

       {currentOrder && currentOrder.paymentMethod ==='card' && 
       (<Navigate to={`/stripe-checkout/`} 
         replace={true}></Navigate>)}


   <div className="mx-auto bg-slate-50 max-w-6xl px-4 sm:px-6 lg:px-8">

    <div className="grid grid-cols-1 gap-x-7 gap-y-10 lg:grid-cols-5">
        <div class="lg:col-span-3">
    <form className='bg-white shadow px-5 mt-12 py-12' noValidate onSubmit={handleSubmit((data)=>{
      console.log(data);
       dispatch(updateUserAsync({...user,addresses:[...user.addresses,data]})
      );
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
                 {...register('name',{required:'name is required'})}
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
                  {...register('email',{required:'email is required'})}
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
                  {...register('phone',{required:'phone is required'})}
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
                  {...register('street',{required:'street-address is required'})}
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
                  {...register('city',{required:'city is required'})}
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
                  {...register('state',{required:'state is required'})}
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
                  {...register('pinCode',{required:'pinCode is required'})}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Reset
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        Add Address
        </button>
      </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Address</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Choose From Existing Addresses
          </p>
          <ul role="list">
                {user.addresses.map((address, index) => (
                  <li
                    key={index}
                    className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200"
                  >
                    <div className="flex gap-x-4">
                      <input
                        onChange={handleAddress}
                        name="address"
                        type="radio"
                        value={index}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {address.name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {address.street}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {address.pinCode}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm leading-6 text-gray-900">
                        Phone: {address.phone}
                      </p>
                      <p className="text-sm leading-6 text-gray-500">
                        {address.city}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

          <div className="mt-10 space-y-10">
           
            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">Payment Method</legend>
              <p className="mt-1 text-sm/6 text-gray-600">Choose One</p>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-x-3">
                  <input
    
                    id="cash"
                    value="cash"
                    onChange={handlePayment}
                    name="payments"
                    type="radio"
                    checked={paymentMethod === "cash"}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                  <label htmlFor="cash" className="block text-sm/6 font-medium text-gray-900">
                    Cash
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="card"
                    onChange={handlePayment}
                    value="card"
                    checked={paymentMethod === "card"}
                    name="payments"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                     />
                  <label htmlFor="card" className="block text-sm/6 font-medium text-gray-900">
                    Card Payment
                  </label>
                </div>
               
              </div>
            </fieldset>
          </div>
        </div>
      </div>

     
    </form>
    </div>
    <div class="lg:col-span-2">
   <div className="mx-auto bg-white mt-12 max-w-2xl px-2 sm:px-2 lg:px-4">
     <div className="border-t border-gray-200 px-0 py-6 sm:px-0">
     <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">Cart</h1>
  
      <div className="flow-root">
        <ul role="list" className="-my-6 divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="flex py-6">
              <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img alt={item.product.title} src={item.product.thumbnail} className="size-full object-cover" />
              </div>
  
              <div className="ml-3 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>
                      <a href={item.product.id}>{item.product.title}</a>
                    </h3>
                    <p className="ml-4">${discountedPrice(item.product)}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.product.brand}</p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <div className="text-gray-500">
                  <label htmlFor="quantity" className="inline mr-5 text-sm/6 font-medium text-gray-900">
                    Qty
                  </label>
                    <select onChange={(e)=>handleQuantity(e,item)} value={item.quantity}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
  
                  <div className="flex">
                    <button
                    onClick={e=>handleRemove(e,item.id)} 
                    type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  
  
  <div className="border-t border-gray-200 px-2 py-6 sm:px-2">
    <div className="flex justify-between my-2 text-base font-medium text-gray-900">
      <p>Subtotal</p>
      <p>${totalAmount}</p>
    </div>
    <div className="flex justify-between my-2 text-base font-medium text-gray-900">
      <p>Total Item In Cart</p>
      <p>{totalItems} items</p>
    </div>
    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
    <div className="mt-6">
      <div
      onClick={handleOrder}
        className="flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
      >
        Order Now
      </div>
    </div>
    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
      <p>
        or{' '}
        <Link to = "/">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Continue Shopping
          <span aria-hidden="true"> &rarr;</span>
        </button>
        </Link>
      </p>
    </div>
  </div>
  </div>
    </div>
    </div>
    </div>
    </>
  )
}
export default Checkout;