import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Navigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import Modal from '../common/Modal';
// import {

//   increment,
//   incrementAsync,
//   selectCount,
// } from './cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { deleteItemFromCartAsync, selectCartLoaded, selectCartStatus, selectItems, updateCartAsync } from './cartSlice';
import { discountedPrice } from '../../app/constants';


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

export default function Cart() {
  // const count = useSelector(selectCount);
  const [open, setOpen] = useState(true)
  const [openModal, setOpenModal] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectItems);
  const totalAmount = items.reduce((amount, item)=>discountedPrice(item.product) * item.quantity + amount,0)
  const totalItems = items.reduce((total, item)=>item.quantity + total,0)
  const status = useSelector(selectCartStatus);
  const cartLoaded = useSelector(selectCartLoaded);

  const handleQuantity = (e,item)=>{
  dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value}))
  }

  const handleRemove = (e,id)=>{
    dispatch(deleteItemFromCartAsync(id))
  }

  return (
    <>
    {!items.length && cartLoaded && <Navigate to="/" replace={true}></Navigate>}
   <div className="mx-auto bg-slate-50 mt-12 max-w-2xl px-4 sm:px-6 lg:px-8">
   <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
   <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">Cart</h1>

    <div className="flow-root">
      {status==='loading'?<ColorRing
                visible={true}                                      
                height="80"
                width="80"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                /> :null}
              
       
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
                <Modal title={`Delete ${item.product.title}`}
                message="Are you sure you want to delete this cart item" 
                dangerOption="Delete" 
                cancelOption="Cancel" 
                dangerAction={e=>handleRemove(e,item.id)}
                cancelAction={()=>setOpenModal(null)}
                  showModal={openModal === item.id}>
                </Modal>
                  <button
                  onClick={e=>{setOpenModal(item.id)}} 
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


<div className="border-t border-gray-200 px-4 py-6 sm:px-6">
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
    <Link
      to="/checkout"
      className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
    >
      Checkout
    </Link>
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

   </>
  
  )
}

