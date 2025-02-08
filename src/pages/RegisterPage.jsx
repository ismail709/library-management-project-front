import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAlert } from "../components/AlertContextProvider";

function handleRegister(e) {
	e.preventDefault();
	return axiosClient.post("/users", new FormData(e.target));
}

export default function RegisterPage() {
	const [errors, setErrors] = useState([]);
	const navigate = useNavigate();
	const { showAlert } = useAlert();

	const mutation = useMutation({
		mutationFn: handleRegister,
		onSuccess: (data, vars, context) => {
			setErrors([]);
			showAlert("Registered Successfully!");
			navigate("/login");
		},
		onError: (error, vars, context) => {
			setErrors(Object.values(error.response.data.errors));
		},
	});

	return (
		<div className="flex justify-center items-center py-8 md:py-24">
			<div className="bg-white px-2 md:p-8 rounded-sm shadow-none md:shadow-lg w-full max-w-full sm:max-w-md">
				<h1 className="text-2xl font-bold text-center mb-6">
					Register
				</h1>
				<form
					onSubmit={mutation.mutate}
					className="flex flex-col space-y-4"
				>
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
						<label
							htmlFor="name"
							className="font-medium text-gray-700"
						>
							Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							className="border-2 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
							placeholder="Enter your name"
						/>
					</div>

					{/* Email Input */}
					<div className="flex flex-col">
						<label
							htmlFor="email"
							className="font-medium text-gray-700"
						>
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
						<label
							htmlFor="password"
							className="font-medium text-gray-700"
						>
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

					{/* Password Confirmation */}
					<div className="flex flex-col">
						<label
							htmlFor="password_confirmation"
							className="font-medium text-gray-700"
						>
							Confirm Password
						</label>
						<input
							type="password"
							name="password_confirmation"
							id="password_confirmation"
							className="border-2 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
							placeholder="Confirm your password"
						/>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={mutation.isPending}
						className="bg-amber-400 text-black disabled:cursor-not-allowed disabled:text-amber-700 font-bold py-2 rounded-sm hover:bg-amber-500 transition duration-300"
					>
						{mutation.isPending ? "Registering..." : "Register"}
					</button>
				</form>
			</div>
		</div>
	);
}
