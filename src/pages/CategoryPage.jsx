import { useParams } from "react-router";
import { axiosClient } from "../api/axios";
import {
	useInfiniteQuery,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import CategoryCard from "../components/CategoryCard";
import BookCard from "../components/BookCard";
import { useEffect, useState } from "react";

async function fetchBooksByCategory(id, pageParam) {
	return (
		await axiosClient.get("/books/c/" + id, { params: { page: pageParam } })
	).data;
}

async function fetchCategories() {
	return (await axiosClient.get("/categories")).data;
}

export default function CategoryPage() {
	const { id } = useParams();
	const [category, setCategory] = useState(null);
	const queryClient = useQueryClient();

	const categories = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories,
		staleTime: 1000 * 60 * 60,
	});

	useEffect(() => {
		let category_cache = queryClient.getQueryData(["categories"]);

		if (id && category_cache) {
			setCategory(
				category_cache.find((c) => c.id == id)
			);
		}
	}, [id, categories.isSuccess]);

	const booksByCategory = useInfiniteQuery({
		queryKey: ["books", { category: id }],
		queryFn: ({ pageParam }) => fetchBooksByCategory(id, pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.current_page < lastPage.last_page) {
				return lastPage.current_page + 1;
			} else {
				return undefined;
			}
		},
		enabled: !!id,
		staleTime: 1000 * 60 * 60,
	});

	if (!id) {
		return (
			<div className="flex flex-col items-center gap-4 py-8 px-2">
				<h1 className="text-2xl font-bold">All Categories</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full max-w-full">
					{categories.isPending &&
						new Array(10)
							.fill(null)
							.map((e, i) => <CategoryCard key={i} />)}
					{categories.isSuccess &&
						categories.data.map((category, i) => (
							<CategoryCard key={i} category={category} />
						))}
				</div>
			</div>
		);
	} else {
		return (
			<div className="flex flex-col justify-center items-center gap-4 py-8 w-full max-w-full">
				{!category && (
					<div className="h-6 bg-gray-300 rounded w-60 animate-pulse"></div>
				)}
				{category && (
					<h1 className="text-2xl font-bold capitalize">
						{category.name}
					</h1>
				)}
				<div className="px-2 grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full max-w-full">
					{booksByCategory.isPending &&
						new Array(10)
							.fill(null)
							.map((e, i) => <BookCard key={i} />)}
					{booksByCategory.isSuccess &&
						booksByCategory.data.pages.map((page) => {
							return page.data.map((book, i) => (
								<BookCard book={book} key={i} />
							));
						})}
				</div>
				{booksByCategory.isSuccess && (
					<button
						className="rounded-sm bg-amber-400 px-8 py-4 cursor-pointer disabled:cursor-not-allowed disabled:text-amber-600 disabled:bg-amber-500 hover:bg-amber-500 hover:text-white font-bold"
						onClick={() => booksByCategory.fetchNextPage()}
						disabled={
							!booksByCategory.hasNextPage ||
							booksByCategory.isFetchingNextPage
						}
					>
						{booksByCategory.isFetchingNextPage
							? "Loading more..."
							: booksByCategory.hasNextPage
							? "Load more"
							: "Nothing more to load"}
					</button>
				)}
			</div>
		);
	}
}
