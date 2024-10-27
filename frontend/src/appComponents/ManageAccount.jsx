import Footer from "./Footer";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const ManageAccount = () => {
   const navigate = useNavigate();
   const [user, setUser] = useState({
      name: '',
      firstName: '',
      lastName: '',
      email: '',
      jobInfo: '',
      address: {
         street: '',
         city: '',
         region: '',
         postalCode: ''
      }
   });
   const location = useLocation();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setUser((prevUser) => ({
         ...prevUser,
         [name]: value
      }));
   };

   const handleAddressChange = (e) => {
      const { name, value } = e.target;
      setUser((prevUser) => ({
         ...prevUser,
         address: {
            ...prevUser.address,
            [name]: value
         }
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post('http://localhost:3000/api/auth/update-user', {
            user
         });
         console.log(response);
   
         if (response.status === 200) {
            setUser((prevUser) => ({
               ...prevUser,
               ...response.data.user
            }));
            location.state.user = response.data.user;
            alert('User data updated successfully');
            navigate('/home', { replace: true });
         }
      } catch (error) {
         console.error(error);
         if (error.response) {
            alert('Failed to update user data: ' + error.response.data.message);
         } else {
            alert('Failed to update user data');
         }
      }
   };

   useEffect(() => {
      if (location.state?.user) {
         setUser(location.state.user);
      }
   }, [location]); 


   return (
      <>
         <Navbar />
         <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Account</h1>
            </div>
         </header>
         <div className="flex justify-center my-20">
            <form onSubmit={handleSubmit} className="border-2 w-2/4 border-sky-500 shadow-xl p-20 rounded-2xl">
               <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                     <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                     <p className="mt-1 text-sm leading-6 text-gray-600">
                        This information will be displayed publicly so be careful what you share.
                     </p>

                     <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                           <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                              Username
                           </label>
                           <div className="mt-2">
                              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md">
                                 <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">colab.com/</span>
                                 <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="yourname"
                                    autoComplete="name"
                                    value={user.name}
                                    readOnly={true}
                                    onChange={handleChange}
                                    className="block flex-1 border-0 cursor-not-allowed bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                 />
                              </div>
                           </div>
                        </div>

                        {/* Profile Photo */}
                        <div className="col-span-full">
                           <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                              Photo
                           </label>
                           <div className="mt-2 flex items-center gap-x-3">
                              <button
                                 type="button"
                                 className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                 Change
                              </button>
                           </div>
                        </div>
                        <div className="col-span-full">
                           <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                              Cover photo
                           </label>
                           <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                              <div className="text-center">
                                 {/* <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" /> */}
                                 <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                       htmlFor="file-upload"
                                       className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                       <span>Upload a file</span>
                                       <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                 </div>
                                 <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                              </div>
                           </div>
                        </div>

                        {/* Personal Information */}
                        <div className="sm:col-span-3">
                           <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                              First name
                           </label>
                           <input
                              id="first-name"
                              name="firstName"
                              type="text"
                              autoComplete="given-name"
                              value={user.firstName}
                              onChange={handleChange}
                              className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           />
                        </div>

                        <div className="sm:col-span-3">
                           <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                              Last name
                           </label>
                           <input
                              id="last-name"
                              name="lastName"
                              type="text"
                              autoComplete="family-name"
                              value={user.lastName}
                              onChange={handleChange}
                              className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           />
                        </div>

                        <div className="sm:col-span-4">
                           <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                              Email address
                           </label>
                           <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              value={user.email}
                              onChange={handleChange}
                              className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           />
                        </div>

                        <div className="col-span-full">
                           <label htmlFor="job-description" className="block text-sm font-medium leading-6 text-gray-900">
                              Job Description
                           </label>
                           <textarea
                              id="job-description"
                              name="jobInfo"
                              rows={3}
                              value={user.jobInfo}
                              onChange={handleChange}
                              className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           />
                           <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about your job profile.</p>
                        </div>

                        <div className="col-span-full">
                           <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                              Street address
                           </label>
                           <input
                              id="street-address"
                              name="street"
                              type="text"
                              autoComplete="street-address"
                              value="Nagala Park"
                              onChange={handleAddressChange}
                              className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           />
                        </div>

                        <div className="sm:col-span-3">
                           <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                              City
                           </label>
                           <input
                              id="city"
                              name="city"
                              type="text"
                              value="Kolhapur"
                              onChange={handleAddressChange}
                              className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           />
                        </div>

                        <div className="sm:col-span-3">
                           <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                              Region
                           </label>
                           <input
                              id="region"
                              name="region"
                              type="text"
                              value="Maharashtra"
                              onChange={handleAddressChange}
                              className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           />
                        </div>

                        <div className="sm:col-span-3">
                           <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                              Postal code
                           </label>
                           <input
                              id="postal-code"
                              name="postalCode"
                              type="text"
                              value="416 003"
                              onChange={handleAddressChange}
                              className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           />
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-x-4">
                     <button
                        type="button"
                        className="rounded-md bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                     >
                        Cancel
                     </button>
                     <button
                        type="submit"
                        className="rounded-md bg-sky-500 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-sky-600"
                     >
                        Save
                     </button>
                  </div>
               </div>
            </form>
         </div>
         <Footer />
      </>
   );
};

export default ManageAccount;
