import { Link } from "react-router";
import { motion } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { axiosClient } from "../api/axios";

async function fetchBook(slug){
    return (await axiosClient.get("/books/"+slug)).data;
}

export default function BookCard({ book, className }) {
	const queryClient = useQueryClient();

	const prefetch = useCallback(() => {
		queryClient.prefetchQuery({
			queryKey: ["book", { slug: book.slug }],
			queryFn: () => fetchBook(book.slug),
			staleTime: 1000 * 60 * 60,
		});
	}, [book]);

	if (!book)
		return (
			<div className="w-48 animate-pulse">
				<div className="w-48 h-64 bg-gray-300 rounded-sm"></div>
				<div className="mt-2 h-4 bg-gray-300 rounded w-3/4"></div>
				<div className="mt-1 h-4 bg-gray-300 rounded w-1/2"></div>
			</div>
		);
	return (
		<Link to={`/book/${book.slug}`} onMouseEnter={prefetch}>
			<motion.div
				whileHover={{
					scale: 1.1,
					transition: { duration: 0.2 },
				}}
				className={`flex flex-col w-48 bg-white ${className}`}
			>
				<div className="flex justify-center">
					<img
						className="w-48 h-auto object-contain"
						src={`${import.meta.env.VITE_BASE_IMG_URL}/${
							book.cover_image
						}`}
					/>
				</div>
				<div className="flex flex-col">
					<h2 className="font-bold line-clamp-2 capitalize">
						{book.title}
					</h2>
					<h3 className="font-bold text-slate-500 capitalize">
						{book.author}
					</h3>
				</div>
			</motion.div>
		</Link>
	);
}
