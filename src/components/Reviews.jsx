import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { axiosClient } from "../api/axios";
import { useContext, useRef, useState } from "react";
import { useParams } from "react-router";
import RatingViewer from "./RatingViewer";
import RatingInput from "./RatingInput";
import { UserContext } from "../context/UserContext";

async function fetchReviews(slug, pageParam) {
	return (
		await axiosClient.get(`/reviews/${slug}`, {
			params: { page: pageParam },
		})
	).data;
}

async function postReview(e, slug) {
	e.preventDefault();
	return (
		await axiosClient.post(`/reviews/store/${slug}`, new FormData(e.target))
	).data;
}

export default function Reviews() {
	const { slug } = useParams();
	const [errors, setErrors] = useState("");
	const queryClient = useQueryClient();
	const formRef = useRef(null);
	const ratingInputRef = useRef(null);
	const { user } = useContext(UserContext);

	const reviewsQuery = useInfiniteQuery({
		queryKey: ["reviews", { slug }],
		queryFn: ({ pageParam }) => fetchReviews(slug, pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.current_page < lastPage.last_page) {
				return lastPage.current_page + 1;
			} else {
				return undefined;
			}
		},
		staleTime: 1000 * 60 * 60,
	});

	const mutation = useMutation({
		mutationFn: (e) => postReview(e, slug),
		onSuccess: (data) => {
			// resets the form
			formRef.current.reset();
			// resets the rating input
			ratingInputRef.current.reset();
			// reftech the new data
			queryClient.refetchQueries({ queryKey: ["reviews"] });
			// remove the errors
			setErrors([]);
		},
		onError: (error) => {
			setErrors(Object.values(error.response.data.errors));
		},
	});

	return (
		<>
			<div className="flex border-b pb-2 border-slate-500 items-baseline">
				<h2 className="text-2xl font-bold capitalize">Reviews</h2>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
				{/* Add Review Form */}
				<div className="shadow-none md:shadow-lg rounded-sm self-start justify-self-center w-full md:w-sm p-2 md:p-8">
					<h3 className="text-lg font-semibold mb-2">Add a Review</h3>
					<form
						ref={formRef}
						onSubmit={mutation.mutate}
						className="flex flex-col space-y-2"
					>
						{/* Error Messages */}
						{errors.length > 0 && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">
								{errors.map((e, i) => (
									<p key={i}>{e}</p>
								))}
							</div>
						)}
						<div className="flex flex-col">
							<label
								htmlFor="comment"
								className="font-medium text-gray-700"
							>
								Review
							</label>
							<textarea
								id="comment"
								name="comment"
								placeholder="(Optional)"
								className="border-2 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
							/>
						</div>
						<div className="flex flex-col">
							<label
								htmlFor="comment"
								className="font-medium text-gray-700"
							>
								Rating
							</label>
							<RatingInput ref={ratingInputRef} />
						</div>
						<button
							type="submit"
							className="bg-amber-400 text-black disabled:cursor-not-allowed disabled:text-amber-700 font-bold py-2 rounded-sm hover:bg-amber-500 transition duration-300"
							disabled={mutation.isPending}
						>
							{mutation.isPending
								? "Submitting..."
								: "Submit Review"}
						</button>
					</form>
				</div>
				<div className="">
					{reviewsQuery.isLoading && (
						<div className="flex flex-col gap-4 items-center w-full animate-pulse">
							<ul className="w-full">
								{Array(5)
									.fill(null)
									.map((_, index) => (
										<li
											key={index}
											className="p-4 border-b"
										>
											<div className="flex items-center justify-between gap-4">
												<div>
													<div className="bg-gray-300 rounded w-40 h-6"></div>
													<div className="bg-gray-300 rounded w-24 h-4 mt-1"></div>
												</div>
												<div className="bg-gray-300 rounded w-32 h-6"></div>
											</div>
											<div className="bg-gray-300 rounded w-2/3 h-4 mt-4"></div>
											<div className="bg-gray-300 rounded w-5/6 h-4 mt-4"></div>
											<div className="bg-gray-300 rounded w-1/3 h-4 mt-4"></div>
										</li>
									))}
							</ul>
							<div className="bg-gray-300 rounded w-32 h-10 mt-4"></div>
							{/* Button placeholder */}
						</div>
					)}
					{reviewsQuery.isSuccess ? (
						reviewsQuery.data.pages[0].data.length == 0 ? (
							<p className="text-xl text-slate-500 text-center">Be the first to write a review</p>
						) : (
							<div className="flex flex-col gap-4 items-center">
								<ul className="w-full">
									{reviewsQuery.data.pages.map((page) => {
										return page.data.map((review) => (
											<li
												key={review.id}
												className="p-4 border-b-2 border-slate-300"
											>
												<div className="flex items-center justify-between">
													<div>
														<div
															className={`font-semibold text-xl capitalize ${
																review.user
																	.id ==
																	user.id &&
																"text-amber-500"
															}`}
														>
															{review.user.name}
														</div>
														{/* Display user name */}
														<div className="text-slate-500 text-sm">
															{new Date(
																review.created_at
															).toLocaleDateString()}
														</div>
													</div>
													<RatingViewer
														rating={review.rating}
													/>
												</div>
												{review.comment ? (
													<p className="mt-2 line-clamp-4 hover:line-clamp-none">
														{review.comment}
													</p>
												) : (
													<p className="mt-2 text-slate-500">
														No comment.
													</p>
												)}
											</li>
										));
									})}
								</ul>
								<button
									className="rounded-sm bg-amber-400 px-8 py-4 cursor-pointer disabled:cursor-not-allowed disabled:text-amber-600 disabled:bg-amber-500 hover:bg-amber-500 hover:text-white font-semibold"
									onClick={() => reviewsQuery.fetchNextPage()}
									disabled={
										!reviewsQuery.hasNextPage ||
										reviewsQuery.isFetchingNextPage
									}
								>
									{reviewsQuery.isFetchingNextPage
										? "Loading more..."
										: reviewsQuery.hasNextPage
										? "Load more"
										: "Nothing more to load"}
								</button>
							</div>
						)
					) : null}
				</div>
			</div>
		</>
	);
}
