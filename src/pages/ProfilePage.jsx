import { useState, useContext, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../api/axios";
import { UserContext } from "../context/UserContext";
import { useAlert } from "../components/AlertContextProvider";

export default function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const { showAlert } = useAlert();

  const nameRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(()=>{
    nameRef.current.value = user.name;
    emailRef.current.value = user.email;
  },[user]);

  const [errors, setErrors] = useState([]);

  // Mutation for updating profile
  const mutation = useMutation({
    mutationFn: (e) => {
        e.preventDefault();
        const d = new FormData(e.target);
        for(let x of d.entries()){
            console.log(x);
        }
        return axiosClient.put(`/users/edit/${user.id}`,new FormData(e.target),{
            headers:{
                "Content-Type": "application/json"
            }
        });
    },
    onSuccess: (data) => {
        console.log(data.data.user)
        setUser(data.data.user); // Update user in context
        setErrors([]);
        showAlert("Profile updated successfully!");
    },
    onError: (error) => {
      setErrors(error.response?.data?.errors ? Object.values(error.response.data.errors) : ["An unexpected error occurred"]);
    },
  });

  return (
    <div className="flex justify-center items-center py-24">
      <div className="bg-white p-8 rounded-sm shadow-lg w-full max-w-full sm:max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Profile</h1>
        <form onSubmit={mutation.mutate} className="flex flex-col space-y-4">
          
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">
              {errors.map((e, i) => (
                <p key={i}>{e}</p>
              ))}
            </div>
          )}

          {/* Name Input */}
          <div className="flex flex-col">
            <label htmlFor="name" className="font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              ref={nameRef}
              className="border-2 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your name"
              required
              autoComplete="off"
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col">
            <label htmlFor="email" className="font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              ref={emailRef}
              className="border-2 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label htmlFor="password" className="font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="border-2 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter new password"
            />
          </div>

          {/* Password Confirmation */}
          <div className="flex flex-col">
            <label htmlFor="password_confirmation" className="font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              className="border-2 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Confirm new password"
            />
          </div>

          {/* Submit Button */}
          <button
                type="submit"
                disabled={mutation.isPending}
                className="bg-amber-400 text-black disabled:cursor-not-allowed disabled:text-amber-700 font-bold py-2 rounded-sm hover:bg-amber-500 transition duration-300"
              >
                {mutation.isPending ? "Updating..." : "Update Profile"}
              </button>
        </form>
      </div>
    </div>
  );
}
