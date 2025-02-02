import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosClient } from "../api/axios";
import BookCard from "../components/BookCard";

function fetchPopularBooks(pageParam) {
    return axiosClient.get("/books/popular",{params:{page:pageParam}});
}


export default function PopularPage(){
    const popularBooksQuery = useInfiniteQuery({
        queryKey: ["popularpage"],
        queryFn: ({pageParam}) => fetchPopularBooks(pageParam),
        initialPageParam:1,
        getNextPageParam: (lastPage) => {
            if(lastPage.data.current_page < lastPage.data.last_page){
                return lastPage.data.current_page + 1;
            }else {
                return undefined;
            }
        },
    })
    return <div className="flex flex-col justify-center items-center gap-4 py-8 w-full max-w-full">
                        <h1 className="text-2xl font-bold capitalize">Popular Books</h1>
                        <div className="grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full max-w-full">
                        {popularBooksQuery.isPending && new Array(10).fill(null).map((e,i) => <BookCard key={i} />)}
                        {popularBooksQuery.isSuccess && popularBooksQuery.data.pages.map((page) => {return page.data.data.map((book,i) => <BookCard book={book} key={i} />)})}
                        {popularBooksQuery.isSuccess ? (popularBooksQuery.data.pages[0].data.data.length == 0 && <div className="flex flex-col justify-center items-center h-80 col-span-4"><svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" className="fill-slate-300"><path d="M479.98-280q14.02 0 23.52-9.48t9.5-23.5q0-14.02-9.48-23.52t-23.5-9.5q-14.02 0-23.52 9.48t-9.5 23.5q0 14.02 9.48 23.52t23.5 9.5ZM453-433h60v-253h-60v253Zm27.27 353q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg><p className="text-slate-300 font-bold text-2xl">No Results!</p></div>): null}
                        </div>
                        {popularBooksQuery.isSuccess &&
                        <button 
                            className="rounded-sm bg-amber-400 px-8 py-4 cursor-pointer disabled:cursor-not-allowed disabled:text-amber-600 disabled:bg-amber-500 hover:bg-amber-500 hover:text-white font-bold"
                            onClick={() => popularBooksQuery.fetchNextPage()}
                            disabled={!popularBooksQuery.hasNextPage || popularBooksQuery.isFetchingNextPage}
                        >
                            {popularBooksQuery.isFetchingNextPage? 'Loading more...' : popularBooksQuery.hasNextPage ? 'Load more' : 'Nothing more to load'}
                        </button>
                        }
                    </div>
}