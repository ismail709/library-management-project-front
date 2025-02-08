import { Link, Navigate, useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../api/axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import BooksSection from "../components/BooksSection";
import Reviews from "../components/Reviews";

async function fetchBook(slug) {
	return (await axiosClient.get("/books/" + slug, { params: { view: true } }))
		.data;
}

async function fetchRecommendedBooks(slug) {
	return (await axiosClient.get("/books/recommended/" + slug)).data;
}

async function toggleFavorites(id) {
	return (await axiosClient.get("/favorites/" + id)).data;
}

export default function BookPage() {
	const { slug } = useParams();
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [isFavorite, setIsFavorite] = useState(false);
	const queryClient = useQueryClient();

	const { data, isPending, isSuccess, isError } = useQuery({
		queryKey: ["book", { slug }],
		queryFn: () => fetchBook(slug),
		staleTime: 1000 * 60 * 60,
	});

	const recommendedBooks = useQuery({
		queryKey: ["recommended", { slug }],
		queryFn: () => fetchRecommendedBooks(slug),
		staleTime: 1000*60*60
	});

	useEffect(() => {
		if (isSuccess) {
			setIsFavorite(data.is_favorite);
		}
	}, [isSuccess]);

	const book = data?.book;

	const favoriteMutation = useMutation({
		mutationFn: () => toggleFavorites(book.id),
		onSuccess: (data) => {
			queryClient.refetchQueries({queryKey:["favorites"]});
			queryClient.refetchQueries({queryKey:["book",{slug}]});
			setIsFavorite(data.is_favorite);
		},
		onError: (error) => {
			console.log("error", error);
		},
	});

	const handleAddToFavorite = useCallback(() => {
		if (!user) navigate("/login");
		else favoriteMutation.mutate();
	}, []);

	if (isPending)
		return (
			<div className="py-8 px-2 flex flex-col md:flex-row gap-4 w-full max-w-sm md:max-w-full mx-auto animate-pulse">
				{/* Book Cover */}
				<div className="flex justify-center">
					<div className="w-full md:w-64 h-96 bg-gray-300 rounded-sm"></div>
				</div>

				{/* Book Details */}
				<div className="flex flex-col justify-between gap-4 w-full">
					<div>
						<div className="h-8 bg-gray-300 rounded w-3/4"></div>
						<div className="mt-4 h-4 bg-gray-300 rounded w-1/2"></div>
					</div>

					{/* Buttons */}
					<div className="flex flex-col md:flex-row md:justify-end gap-2">
						<div className="h-12 bg-gray-300 rounded min-w-48"></div>
						<div className="h-12 bg-gray-300 rounded min-w-48"></div>
					</div>
				</div>
			</div>
		);
	if (isError || !book) return <>hello</>;
	// if (isError || !book) return <Navigate to="/" />;
	return (
		<div className="py-8 px-2 flex flex-col gap-4">
			<div className="flex flex-col md:flex-row gap-4 w-full max-w-sm md:max-w-full mx-auto">
				{/* Book Cover */}
				<div className="flex justify-center shrink-0">
					<img
						src={`${import.meta.env.VITE_BASE_IMG_URL}/${
							book.cover_image
						}`}
						alt={book.title}
						className="w-full md:w-64 h-auto object-contain"
					/>
				</div>

				{/* Book Details */}
				<div className="flex flex-col justify-between gap-4 w-full">
					<div>
						<h1 className="text-4xl font-bold text-gray-800">
							{book.title}
						</h1>
						<p className="text-lg text-gray-600 mt-1">
							by {book.author}
						</p>
					</div>

					{/* Buttons */}
					<div className="flex flex-col md:flex-row md:justify-end gap-2">
						<Link
							to={`/rent/${slug}`}
							className="text-center bg-amber-400 hover:bg-amber-500 text-black font-bold px-6 py-3 min-w-40 rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						>
							Rent
						</Link>
						<button
							onClick={handleAddToFavorite}
							className={`${
								isFavorite
									? "bg-rose-500 hover:bg-rose-600 text-white"
									: "bg-slate-300 hover:bg-slate-400 text-slate-600"
							} px-6 py-3 rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
							disabled={favoriteMutation.isPending}
						>
							{favoriteMutation.isPending
								? "Loading..."
								: isFavorite
								? "Remove from favorites"
								: "Add to favorites"}
						</button>
					</div>
				</div>
			</div>
			<BooksSection query={recommendedBooks} title="People also rented" />
            <Reviews />
		</div>
	);
}
