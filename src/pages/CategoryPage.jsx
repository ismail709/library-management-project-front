import { useParams } from "react-router"
import { axiosClient } from "../api/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import CategoryCard from "../components/CategoryCard";
import BookCard from "../components/BookCard";


function fetchBooksByCategory(id,pageParam){
    return axiosClient.get("/books/c/"+id,{params:{page:pageParam}});
}
function fetchCategory(id){
    return axiosClient.get("/categories/"+id);
}

function fetchCategories(){
    return axiosClient.get("/categories");
}


export default function CategoryPage(){
    const {id} = useParams();

    const categories = useQuery({
        queryKey:["categories"],
        queryFn: fetchCategories,
        enabled: !id
    });

    const category = useQuery({
        queryKey: ["category",{id}],
        queryFn: () => fetchCategory(id),
        enabled: !!id
    });

    const booksByCategory = useInfiniteQuery({
        queryKey: ["books",{category:id}],
        queryFn: ({pageParam}) => fetchBooksByCategory(id,pageParam),
        initialPageParam:1,
        getNextPageParam: (lastPage) => {
            if(lastPage.data.current_page < lastPage.data.last_page){
                return lastPage.data.current_page + 1;
            }else {
                return undefined;
            }
        },
        enabled: !!id
    })

    if(!id){
        return <div className="flex flex-col items-center gap-4 py-8 px-8 lg:px-0">
            <h1 className="text-2xl font-bold">All Categories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full max-w-full">
            {categories.isPending && new Array(10).fill(null).map((e,i) => <CategoryCard key={i} /> )}
            {categories.isSuccess && categories.data.data.map((category,i) => <CategoryCard key={i} category={category} />)}
            </div>
        </div>
    }else{
        return <div className="flex flex-col justify-center items-center gap-4 py-8 w-full max-w-full">
                    {category.isPending && <div className="h-6 bg-gray-300 rounded w-60 animate-pulse"></div>}
                    {category.isSuccess && <h1 className="text-2xl font-bold capitalize">{category.data.data.name}</h1>}
                    <div className="grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full max-w-full">
                    {booksByCategory.isPending && new Array(10).fill(null).map((e,i) => <BookCard key={i} />)}
                    {booksByCategory.isSuccess && booksByCategory.data.pages.map((page) => {return page.data.data.map((book,i) => <BookCard book={book} key={i} />)})}
                    </div>
                    {booksByCategory.isSuccess &&
                    <button 
                        className="rounded-sm bg-amber-400 px-8 py-4 cursor-pointer disabled:cursor-not-allowed disabled:text-amber-600 disabled:bg-amber-500 hover:bg-amber-500 hover:text-white font-bold"
                        onClick={() => booksByCategory.fetchNextPage()}
                        disabled={!booksByCategory.hasNextPage || booksByCategory.isFetchingNextPage}
                    >
                        {booksByCategory.isFetchingNextPage? 'Loading more...' : booksByCategory.hasNextPage ? 'Load more' : 'Nothing more to load'}
                    </button>
                    }
                </div>
    }
}