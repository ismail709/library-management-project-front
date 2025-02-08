// {booksByCategory.isPending && new Array(10).fill(null).map((e,i) => <BookCard key={i} />)}

import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosClient } from "../api/axios";
import { Link } from "react-router";

async function fetchReservations(pageParam) {
	return (await axiosClient.get("/users/reservations", {
		params: { page: pageParam },
	})).data;
}

export default function ReservationsPage() {
	const reservationsQuery = useInfiniteQuery({
		queryKey: ["reservations"],
		queryFn: ({ pageParam }) => fetchReservations(pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.current_page < lastPage.last_page) {
				return lastPage.current_page + 1;
			} else {
				return undefined;
			}
		},
		staleTime: 1000*60*60
	});
	return (
		<div className="flex flex-col justify-center items-center gap-4 py-8 px-2 w-full max-w-full">
			<h1 className="text-2xl font-bold capitalize">My Reservations</h1>
			<div className="w-full max-w-full overflow-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-slate-500 text-left text-slate-600">
							<th className="px-4 py-2 min-w-screen md:min-w-60">
								Book
							</th>
							<th className="px-4 py-2">Rental date</th>
							<th className="px-4 py-2">Due date</th>
							<th className="px-4 py-2">Return date</th>
							<th className="px-4 py-2">Status</th>
						</tr>
					</thead>
					<tbody>
						{reservationsQuery.isSuccess &&
							reservationsQuery.data.pages.map((page) => {
								return page.data.map((reservations, i) => (
									<tr
										key={i}
										className="border-b border-slate-200 text-left"
									>
										<td className="px-4 py-2">
											<div className="flex flex-row gap-4">
												<div className="shrink-0">
													<img
														className="w-24 h-auto object-contain"
														src={`${
															import.meta.env
																.VITE_BASE_IMG_URL
														}/${
															reservations.book
																.cover_image
														}`}
													/>
												</div>
												<h2 className="font-bold line-clamp-2 capitalize">
													<Link
														to={`/book/${reservations.book.slug}`}
													>
														{
															reservations.book
																.title
														}
													</Link>
												</h2>
											</div>
										</td>
										<td className="px-4 py-2 text-slate-500">
											{reservations.rental_date}
										</td>
										<td className="px-4 py-2 text-slate-500">
											{reservations.due_date}
										</td>
										<td className="px-4 py-2 text-slate-500">
											{reservations.return_date
												? reservations.return_date
												: "Not Returned Yet"}
										</td>
										<td className="px-4 py-2">
											{(() => {
												switch (reservations.status) {
													case "pending":
														return (
															<span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-700 ring-inset capitalize">
																{
																	reservations.status
																}
															</span>
														);
													case "rented":
														return (
															<span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700 ring-inset capitalize">
																{
																	reservations.status
																}
															</span>
														);
													case "returned":
														return (
															<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-700 ring-inset capitalize">
																{
																	reservations.status
																}
															</span>
														);
													case "late":
														return (
															<span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-700 ring-inset capitalize">
																{
																	reservations.status
																}
															</span>
														);
												}
											})()}
										</td>
									</tr>
								));
							})}
					</tbody>
				</table>
			</div>
			{reservationsQuery.isSuccess
				? reservationsQuery.data.pages[0].data.length == 0 && (
						<div className="flex flex-col justify-center items-center h-80 col-span-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="48px"
								viewBox="0 -960 960 960"
								width="48px"
								className="fill-slate-300"
							>
								<path d="M479.98-280q14.02 0 23.52-9.48t9.5-23.5q0-14.02-9.48-23.52t-23.5-9.5q-14.02 0-23.52 9.48t-9.5 23.5q0 14.02 9.48 23.52t23.5 9.5ZM453-433h60v-253h-60v253Zm27.27 353q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z" />
							</svg>
							<p className="text-slate-300 font-bold text-2xl">
								No reservations!
							</p>
						</div>
				  )
				: null}
			{reservationsQuery.isSuccess && (
				<button
					className="rounded-sm bg-amber-400 px-8 py-4 cursor-pointer disabled:cursor-not-allowed disabled:text-amber-600 disabled:bg-amber-500 hover:bg-amber-500 hover:text-white font-bold"
					onClick={() => reservationsQuery.fetchNextPage()}
					disabled={
						!reservationsQuery.hasNextPage ||
						reservationsQuery.isFetchingNextPage
					}
				>
					{reservationsQuery.isFetchingNextPage
						? "Loading more..."
						: reservationsQuery.hasNextPage
						? "Load more"
						: "Nothing more to load"}
				</button>
			)}
		</div>
	);
}
