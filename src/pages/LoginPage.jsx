import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "../api/axios";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router";
import Alert from "../components/Alert";
import { useAlert } from "../components/AlertContextProvider";



export default function LoginPage(){
    const [errors,setErrors] = useState([]);

    const {setUser} = useContext(UserContext);
    const navigate = useNavigate();
    const {showAlert} = useAlert();

    function handleLogin(e){
        e.preventDefault();
        return axiosClient.post("/users/login",new FormData(e.target));
    }

    const mutation = useMutation({
        mutationFn: handleLogin,
        onSuccess: (data,vars,context) => {
            setErrors([]);
            setUser(data.data.user)
            showAlert("Logged In Successfully!")
            localStorage.setItem("auth_token",data.data.token)
            navigate("/")
        },
        onError: (error,vars,context) => {
            setErrors(Object.values(error.response.data.errors))
        }
    })
    return (
        <div className="flex justify-center items-center py-8 md:py-24">
          <div className="bg-white px-2 md:p-8 rounded-sm shadow-none md:shadow-lg w-full max-w-full sm:max-w-md">
            <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
            <form onSubmit={mutation.mutate} className="flex flex-col space-y-4">
              {/* Error Messages */}
              {errors.length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">
                  {errors.map((e, i) => (
                    <p key={i}>{e}</p>
                  ))}
                </div>
              )}
      
              {/* Email Input */}
              <div className="flex flex-col">
                <label htmlFor="email" className="font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="border-2 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
      
              {/* Password Input */}
              <div className="flex flex-col">
                <label htmlFor="password" className="font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="border-2 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter your password"
                />
              </div>
      
              {/* Submit Button */}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="bg-amber-400 text-black disabled:cursor-not-allowed disabled:text-amber-700 font-bold py-2 rounded-sm hover:bg-amber-500 transition duration-300"
              >
                {mutation.isPending ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      );
      
}