import { axiosClient } from "../api/axios"
import { useQueries, useQuery } from "@tanstack/react-query";
import BooksSection from "../components/BooksSection";


export default function HomePage(){
    function fetchMostedRentedBooks(){
        return axiosClient.get('/books/mostrented');
    }
    const mostRentedBooksResult = useQuery({
        queryKey: ["mostrented"],
        queryFn: fetchMostedRentedBooks
    })
    function fetchPopularBooks(){
        return axiosClient.get('/books/popular');
    }
    const popularBooksResult = useQuery({
        queryKey: ["popular"],
        queryFn: fetchPopularBooks
    })
    function fetchRecentBooks(){
        return axiosClient.get('/books/recent');
    }
    const recentBooksResult = useQuery({
        queryKey: ["recent"],
        queryFn: fetchRecentBooks
    })
    function fetchFeaturedCategories(){
        return axiosClient.get("/categories/featured");
    }

    const featuredCategories = useQuery({
        queryKey:["featuredcategories"],
        queryFn: fetchFeaturedCategories
    })

    function fetchBooksByCategory(category){
        return axiosClient.get('/books/c/'+category);
    }
    const booksByCategoryResult = useQueries({
        queries: featuredCategories?.data?.data ? 
        featuredCategories.data.data.map((category,i) => {
            return {
                queryKey:['books',{category:category.id}],
                queryFn:() => fetchBooksByCategory(category.id)
            }
        }) : []
    })
    return <div className="flex flex-col gap-4 py-8 px-8 lg:px-0">
        <div className="bg-[url(books.jpeg)]">
            <div className="text-white bg-black/30 transition-all duration-300 ease-in-out hover:backdrop-blur-sm p-8">
                <h1 className="text-2xl font-bold mb-2">Welcome!</h1>
                <p className="text-justify">Welcome to Books Paradise, your go-to platform for discovering, renting, and sharing books with ease. Whether you're an avid reader or just looking for your next great read, we provide a convenient way to browse a vast collection of books, rent them on-demand, and enjoy the stories that await. Our user-friendly platform makes it simple to manage your rentals, explore new genres, and even share your favorites with others. Join our community of book lovers today and unlock a world of knowledge and adventure!</p>
            </div>
        </div>
        <BooksSection to="/mostrented" query={mostRentedBooksResult} title="Most Rented" />
        <BooksSection to="/popular" query={popularBooksResult} title="Popular" />
        <BooksSection to="/recent" query={recentBooksResult} title="Recently Added" />
        {booksByCategoryResult.length > 0 ?
            booksByCategoryResult.map((query,i) => <BooksSection to={`/c/${featuredCategories.data.data[i].id}`} title={featuredCategories.data.data[i].name} query={query} key={i} />)
        : null}
    </div>
}