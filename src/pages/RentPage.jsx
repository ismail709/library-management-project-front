import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { axiosClient } from "../api/axios";
import BookCard from "../components/BookCard";
import { useAlert } from "../components/AlertContextProvider";

async function fetchBook(slug) {
	return (await axiosClient.get("/books/" + slug)).data;
}

function handleRent(e, bookId) {
	e.preventDefault();
	let form = new FormData(e.target);
	form.append("book_id", bookId);
	return axiosClient.post("/reservations", form);
}

export default function RentPage() {
	const [errors, setErrors] = useState([]);
	const { slug } = useParams();
	const [rentalTime, setRentalTime] = useState("10:00");
	const navigate = useNavigate();
	const { showAlert } = useAlert();
  const queryClient = useQueryClient();

	const handleTimeChange = useCallback((e) => {
		console.log(e.target.value);
		let [hours, minutes] = e.target.value.split(":").map(Number);
		let roundedMinutes = Math.round(minutes / 15) * 15;
		if (roundedMinutes == 60) roundedMinutes = 0;
		if (roundedMinutes < 10) roundedMinutes = "0" + roundedMinutes;
		if (hours < 10) hours = "0" + hours;
		setRentalTime(`${hours}:${roundedMinutes}`);
	});

	const { data, isPending, isSuccess, isError } = useQuery({
		queryKey: ["book", { slug }],
		queryFn: () => fetchBook(slug),
	});

	const book = data?.book;

	const mutation = useMutation({
		mutationFn: (e) => handleRent(e, book.id),
		onSuccess: (data) => {
      queryClient.refetchQueries({queryKey:["reservations"]});
			showAlert("Book reserved successfully!");
			navigate("/reservations");
			setErrors([]);
		},
		onError: (error) => {
			console.log(error);
			setErrors(Object.values(error.response.data.errors));
		},
	});

	useEffect(() => {
		// console.log(`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`);
		// rentalDateRef.current.min = new Date().toLocaleDateString().toString();
	}, []);

	return (
		<div className="grid place-items-center py-8 px-2 md:py-24">
      <div className="md:p-8 bg-white rounded-sm shadow-none md:shadow-lg w-full max-w-full sm:max-w-9/12">
			<div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-4">
				{isPending && <BookCard className="md:w-full" />}
				{isSuccess && <BookCard className="md:w-full" book={book} />}
				<div className="col-span-2 w-full md:w-72">
					<h1 className="text-2xl font-bold text-center mb-6">
						Rent a book
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
								Rental date
							</label>
							<input
								type="date"
								id="rental_date"
								name="rental_date"
								className="border-2 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
								placeholder=""
								min={`${new Date().getFullYear()}-${
									new Date().getMonth() + 1
								}-${new Date().getDate()}`}
							/>
						</div>

						{/* Email Input */}
						<div className="flex flex-col">
							<label
								htmlFor="email"
								className="font-medium text-gray-700"
							>
								Rental time
							</label>
							<input
								type="time"
								id="rental_time"
								name="rental_time"
								className="border-2 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
								placeholder=""
								min="09:00"
								max="16:00"
								step={15 * 60}
								value={rentalTime}
								onChange={handleTimeChange}
							/>
						</div>
						{/* Submit Button */}
						<button
							type="submit"
							disabled={mutation.isPending}
							className="bg-amber-400 text-black disabled:cursor-not-allowed disabled:text-amber-700 font-bold py-2 rounded-sm hover:bg-amber-500 transition duration-300"
						>
							{mutation.isPending ? "Renting..." : "Rent"}
						</button>
					</form>
				</div>
			</div>
      </div>
		</div>
	);
}
