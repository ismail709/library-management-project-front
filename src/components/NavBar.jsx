
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router"
import { axiosClient } from "../api/axios";
import { useContext, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import { UserContext } from "../context/UserContext";
import { useAlert } from "./AlertContextProvider";
import Avatar from "./Avatar";


export default function NavBar(){
    const [isMenuOpen,setIsMenuOpen] = useState(false);
    const navmenuRef = useRef(null);

    function fetchFeaturedCategories(){
        return axiosClient.get("/categories/featured");
    }

    const categories = useQuery({
        queryKey:["featuredcategories"],
        queryFn: fetchFeaturedCategories,
        staleTime: Infinity
    })

    useEffect(()=>{
        navmenuRef.current.onclick = () => {
            setIsMenuOpen(false);
        }
    },[]);

    return <>
    <nav className="bg-amber-400 relative p-4 flex flex-col">
        <div className="flex justify-between items-center flex-wrap md:flex-nowrap px-4">
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#000000"><path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/></svg></button>
            <h1 className="text-xl font-bold">Books Paradise</h1>
            <div className="basis-full order-last md:basis-auto md:order-none">
            <SearchBar />
            </div>
            <Avatar />
        </div>
        <div ref={navmenuRef} className={`z-50 md:z-0 bg-white md:bg-transparent shadow-lg md:shadow-none flex flex-col md:flex-row md:justify-center absolute md:relative top-full left-0 w-full transition-all duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
            <Link to="/" className="px-4 py-2 border-b border-slate-400 md:border-0 font-bold hover:underline">Home</Link>
            <Link to="/c" className="px-4 py-2 border-b border-slate-400 md:border-0 font-bold hover:underline">Categories</Link>
            {categories.isSuccess && categories.data.data.map((category,i) => {
                return <Link className="px-4 py-2 border-b border-slate-400 md:border-0 font-bold hover:underline capitalize" key={i} to={`/c/${category.id}`}>{category.name}</Link>;
            })}
        </div>
    </nav>
    </>;
}
