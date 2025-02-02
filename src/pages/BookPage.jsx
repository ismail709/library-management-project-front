import { Link, Navigate, useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../api/axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {useAlert} from "../components/AlertContextProvider";

function fetchBook(slug) {
    return axiosClient.get("/books/"+slug);
}

function toggleFavorites(id) {
    return axiosClient.get("/favorites/"+id);
}

function checkFavorites(id) {
    return axiosClient.get("/favorites/check/"+id);
}

export default function BookPage() {
    const { slug } = useParams();
    const [bookId,setBookId] = useState(null);
    const [isFavorite,setIsFavorite] = useState(false);
    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    
    const { data, isPending, isSuccess, isError } = useQuery({
        queryKey: ["book", {slug}],
        queryFn: () => fetchBook(slug),
    });

    const checkFavoriteQuery = useQuery({
        queryKey: ["checkfavorite",{bookId}],
        queryFn: () => checkFavorites(bookId),
        enabled: !!bookId
    })

    useEffect(()=>{
        if(isSuccess){
            setBookId(data.data.id);
        }
    },[isSuccess]);
    useEffect(()=>{
        if(checkFavoriteQuery.isSuccess){
            setIsFavorite(checkFavoriteQuery.data.data.is_favorite)
        }
    },[checkFavoriteQuery.isSuccess]);
    
    const favoriteMutation = useMutation({
        mutationFn: () => toggleFavorites(bookId),
        onSuccess: (data) => {
            console.log("toggle favorites!",data.data.is_favorite);
            setIsFavorite(data.data.is_favorite)
        },
        onError: (error)=>{
            console.log("error",error)
        }
    });
    
    const handleAddToFavorite = useCallback(() => {
        if(!user) navigate("/login");
        else favoriteMutation.mutate();
    },[]);

    if (isPending) return (
        <div className="py-8 px-8 lg:px-0 flex flex-col md:flex-row gap-4 w-full max-w-sm md:max-w-full mx-auto animate-pulse">
            {/* Book Cover */}
            <div className="flex justify-center">
                <div
                    className="w-full md:w-64 h-96 bg-gray-300 rounded-sm"
                ></div>
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
    if (isError || !data) return <Navigate to="/" />;
    return (
        <div className="py-8 px-8 lg:px-0 flex flex-col md:flex-row gap-4 w-full max-w-sm md:max-w-full mx-auto">
            {/* Book Cover */}
            <div className="flex justify-center shrink-0">
                <img 
                    src={`${import.meta.env.VITE_BASE_IMG_URL}/${data.data.cover_image}`} 
                    alt={data.data.title} 
                    className="w-full md:w-64 h-auto object-contain"
                />
            </div>

            {/* Book Details */}
            <div className="flex flex-col justify-between gap-4 w-full">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">{data.data.title}</h1>
                    <p className="text-lg text-gray-600 mt-1">by {data.data.author}</p>
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
                        className={`${isFavorite ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-slate-300 hover:bg-slate-400 text-slate-600"} px-6 py-3 rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                        disabled={favoriteMutation.isPending}
                    >
                        {favoriteMutation.isPending || checkFavoriteQuery.isPending ? "Loading..." : (isFavorite ? "Remove from favorites" : "Add to favorites")}
                    </button>
                </div>
            </div>
        </div>
    );
}
