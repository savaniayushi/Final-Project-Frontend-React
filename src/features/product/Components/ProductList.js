'use client'
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/20/solid'
import {  fetchBrandsAsync, fetchCategoriesAsync, fetchProductsByFiltersAsync, selectAllProducts, selectBrands, selectCategories, selectTotalItems} from '../productSlice';
import {selectProductListStatus} from "../productSlice";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom';
import { discountedPrice, ITEMS_PER_PAGE } from '../../../app/constants';
import Pagination from '../../common/Pagination';
import { ColorRing } from 'react-loader-spinner';

const sortOptions = [
  { name: 'Best Rating', sort: 'rating', order:'desc', current: false },
  { name: 'Price: Low to High', sort: 'price', order:'asc', current: false },
  { name: 'Price: High to Low', sort: 'price', order:'desc', current: false },
]

const items = [
  { id: 1, title: 'Back End Developer', department: 'Engineering', type: 'Full-time', location: 'Remote' },
  { id: 2, title: 'Front End Developer', department: 'Engineering', type: 'Full-time', location: 'Remote' },
  { id: 3, title: 'User Interface Designer', department: 'Design', type: 'Full-time', location: 'Remote' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductList() {
  const dispatch = useDispatch();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const products = useSelector(selectAllProducts);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const totalItems = useSelector(selectTotalItems);
  const status = useSelector(selectProductListStatus);
  const filters = [
    {
      id: 'category',
      name: 'Category',
      options: categories,
    },
    {
      id: 'brand',
      name: 'Brands',
      options: brands,
    },
    
  ];
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [page, setPage] = useState(1);
   const handleFilter = (e,section,option)=>{
    console.log(e.target.checked);
    const newFilter = {...filter};
    if(e.target.checked){
      if( newFilter[section.id]){
        newFilter[section.id].push(option.value);
      }else{
        newFilter[section.id] = [option.value] 
      }
    }else{
    const index =  newFilter[section.id].findIndex(el=>el===option.value)
    newFilter[section.id].splice(index,1);
    }
    console.log({newFilter});
      setFilter(newFilter)
 }
 const handleSort = (e,option)=>{
  const sort = { _sort:option.sort, _order:option.order};
  console.log({sort});
  setSort(sort)
}
const handlePage = (page)=>{
  console.log({page});
   setPage(page);
}
  useEffect(()=>{
    const pagination = {_page:page,_limit:ITEMS_PER_PAGE }
    dispatch(fetchProductsByFiltersAsync({filter, sort, pagination }))
    // TODO : Server will filter deleted products
  },[dispatch, filter, sort, page]);

useEffect(()=>{
  setPage(1)
},[totalItems,sort])

useEffect(()=>{
  dispatch(fetchBrandsAsync());
},[])

useEffect(()=>{
  dispatch(fetchCategoriesAsync());
},[])
  return (
    <div className="bg-white shadow">
      
      <div>
        {/* Mobile filter dialog */}
        <MobileFilter handleFilter={handleFilter} mobileFiltersOpen={mobileFiltersOpen} Fragment={Fragment} Transition={Transition} setMobileFiltersOpen={setMobileFiltersOpen} filters={filters}></MobileFilter>
       
        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h5 className="text-3xl font-bold tracking-tight text-gray-900">All Products</h5>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <p
                          onClick={e=>handleSort(e,option)}
                        className={
                          'font-medium text-gray-900 text-gray-500 block px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none' // )
                      }
                        >
                          {option.name}
                        </p>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                <span className="sr-only">View grid</span>
                <Squares2X2Icon aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
            <DesktopFilter handleFilter={handleFilter} filters={filters}></DesktopFilter>

              {/* Product grid */}
              <div className="lg:col-span-3">
         <ProductGrid products={products} status={status}></ProductGrid>
              </div> 
            </div>
          </section>

          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <Pagination page={page} setPage={setPage} handlePage={handlePage} totalItems={totalItems}></Pagination>
           </div>
        </main>
      </div>
    </div>
  )
}


function MobileFilter({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  handleFilter,
  filters,
  Transition,
  Fragment
}) {
  return (
    <>
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={setMobileFiltersOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-6">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  onChange={(e) =>
                                    handleFilter(e, section, option)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="ml-3 min-w-0 flex-1 text-gray-500"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                     </Disclosure>
                ))}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
    </>
  );
}
function DesktopFilter({handleFilter, filters}) {
  return (
    <form className="mt-4 border-t border-gray-200">

    {filters.map((section) => (
      <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
        <h3 className="-mx-2 -my-3 flow-root">
          <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">{section.name}</span>
            <span className="ml-6 flex items-center">
              <PlusIcon aria-hidden="true" className="size-5 group-data-[open]:hidden" />
              <MinusIcon aria-hidden="true" className="size-5 group-[&:not([data-open])]:hidden" />
            </span>
          </DisclosureButton>
        </h3>
        <DisclosurePanel className="pt-6">
          <div className="space-y-6">
            {section.options.map((option, optionIdx) => (
              <div key={option.value} className="flex gap-3">
                <div className="flex h-5 shrink-0 items-center">
                  <div className="group grid size-4 grid-cols-1">
                    <input
                      defaultValue={option.value}
                      id={`filter-mobile-${section.id}-${optionIdx}`}
                      name={`${section.id}[]`}
                      type="checkbox" 
                      onChange={(e)=>handleFilter(e, section, option)}
                      className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                    <svg
                      fill="none"
                      viewBox="0 0 14 14"
                      className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                    >
                      <path
                        d="M3 8L6 11L11 3.5"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-has-[:checked]:opacity-100"
                      />
                      <path
                        d="M3 7H11"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-has-[:indeterminate]:opacity-100"
                      />
                    </svg>
                  </div>
                </div>
                <label
                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                  className="min-w-0 flex-1 text-gray-500"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    ))}
  </form>
  );
}
function ProductGrid({products, status}) {
  return (
    <div className="bg-white">
    <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-6xl lg:px-8">

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      
      {status==='loading'?<ColorRing
          visible={true}
          height="80"
          width="80"
          position="top-center"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          /> :null}
        
 
        {products.map((product) => (
          <Link to={`/product-detail/${product.id}`} key={product.id} >
          <div className="group relative border-solid h-full border-2 p-2 border-gray-200 rounded-2xl">
            <img
              alt={product.title}
              src={product.thumbnail}
              className="min-h-6 aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-60"
            />
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <div href={product.thumbnail}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.title}
                  </div>
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  <StarIcon className='w-6 h-6 inline'></StarIcon>
                  <span className='align-bottom'>{product.rating}</span>
                  </p>
              </div>
              <div>
              <p className="text-sm block font-medium text-gray-900">${discountedPrice(product)}</p>

              <p className="text-sm block font-medium text-gray-400 line-through">${product.price}</p>
              </div>
            </div>
            {product.deleted && (
                  <div>
                    <p className='text-sm text-red-400'>product deleted</p>
                  </div>
                  )}
          </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
  );
}



