import { axiosClient } from "../api/axios"
import { useQueries, useQuery } from "@tanstack/react-query";
import BooksSection from "../components/BooksSection";
import { useEffect } from "react";

async function fetchMostedRentedBooks(){
    return (await axiosClient.get('/books/mostrented')).data;
}

async function fetchPopularBooks(){
    return (await axiosClient.get('/books/popular')).data;
}

async function fetchRecentBooks(){
    return (await axiosClient.get('/books/recent')).data;
}

async function fetchFeaturedCategories(){
    return (await axiosClient.get("/categories/featured")).data;
}

async function fetchBooksByCategory(category){
    return (await axiosClient.get('/books/c/'+category)).data;
}

export default function HomePage(){

    const featuredCategories = useQuery({
        queryKey:["featured-categories"],
        queryFn: fetchFeaturedCategories,
        staleTime:1000*60*60
    })
    
    const mostRentedBooksResult = useQuery({
        queryKey: ["mostrented"],
        queryFn: fetchMostedRentedBooks,
        staleTime:1000*60*60
    })
    
    const popularBooksResult = useQuery({
        queryKey: ["popular"],
        queryFn: fetchPopularBooks,
        staleTime:1000*60*60
    })
    
    const recentBooksResult = useQuery({
        queryKey: ["recent"],
        queryFn: fetchRecentBooks,
        staleTime:1000*60*60
    })

    const booksByCategoryResult = useQueries({
        queries: featuredCategories.data ? 
        featuredCategories.data.map((category,i) => {
            return {
                queryKey:['homepage_books',{category:category.id}],
                queryFn:() => fetchBooksByCategory(category.id),
                staleTime:1000*60*60
            }
        }) : []
    })

    return <div className="flex flex-col gap-4 py-8 px-2">
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
            booksByCategoryResult.map((query,i) => <BooksSection to={`/c/${featuredCategories.data[i].id}`} title={featuredCategories.data[i].name} query={query} key={i} />)
        : null}
    </div>
}