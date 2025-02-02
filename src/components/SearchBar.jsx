import { useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosClient } from "../api/axios"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router";


export default function SearchBar(){
    const [query,setQuery] = useState("");
    const [isQueryEnabled,setIsQueryEnabled] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    function fetchBooks(query){
        return axiosClient.get("/books/search",{params:{search:query}})
    }
    const results = useQuery({
        queryKey: ["search",{query}],
        queryFn: () => fetchBooks(query),
        enabled: isQueryEnabled,
    })

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsQueryEnabled(false);
                queryClient.removeQueries({queryKey:["search"]});
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    // enable or disable the query
    useEffect(()=>{
        if(query.length > 0){
            setIsQueryEnabled(true);
        }else{
            setIsQueryEnabled(false);
        }
    },[query]);
    // enable the query if the search bar is re-focused
    const handleFocus = () => {
        if (query.length > 0) {
            setIsQueryEnabled(true); // Re-enable the query fetching when refocusing
        }
    };
    return <div ref={searchRef} className="relative box-border flex bg-white border-2 border-slate-500 md:min-w-96 mt-4 md:mt-0">
        <input 
            placeholder="Search for books..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            className="grow bg-white outline-none text-slate-500 px-3 py-1" 
            type="text" />
        <button className="px-2" onClick={() => {
            navigate(`/search?s=${query}`)
            setIsQueryEnabled(false);
            queryClient.removeQueries({queryKey:["search"]});
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#62748e"><path d="M792-120.67 532.67-380q-30 25.33-69.64 39.67Q423.39-326 378.67-326q-108.44 0-183.56-75.17Q120-476.33 120-583.33t75.17-182.17q75.16-75.17 182.5-75.17 107.33 0 182.16 75.17 74.84 75.17 74.84 182.27 0 43.23-14 82.9-14 39.66-40.67 73l260 258.66-48 48Zm-414-272q79.17 0 134.58-55.83Q568-504.33 568-583.33q0-79-55.42-134.84Q457.17-774 378-774q-79.72 0-135.53 55.83-55.8 55.84-55.8 134.84t55.8 134.83q55.81 55.83 135.53 55.83Z"/></svg>
        </button>
        <div className={`${isQueryEnabled ? "" : "hidden"} bg-white box-border z-50 shadow-lg absolute top-full left-0 w-full flex flex-col gap-1 p-2 max-h-80 overflow-auto`}>
                {results.isFetching ? <div className="w-full h-80 flex justify-center items-center"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#62748e"><path d="M196-331q-20-36-28-72.5t-8-74.5q0-131 94.5-225.5T480-798h43l-80-80 39-39 149 149-149 149-40-40 79-79h-41q-107 0-183.5 76.5T220-478q0 29 5.5 55t13.5 49l-43 43ZM476-40 327-189l149-149 39 39-80 80h45q107 0 183.5-76.5T740-479q0-29-5-55t-15-49l43-43q20 36 28.5 72.5T800-479q0 131-94.5 225.5T480-159h-45l80 80-39 39Z"/></svg></div> : null}
                {results.isSuccess ? (results.data.data.length > 0 ? results.data.data.map((book,i) => {
                    return <Link 
                    to={`/book/${book.slug}`} 
                    onClick={() => setQuery("")}>
                        <div className="flex gap-2 hover:bg-slate-100 hover:cursor-pointer">
                        <img className="h-32" src={`${import.meta.env.VITE_BASE_IMG_URL}/${book.cover_image}`} alt="" />
                        <div>
                            <h2 className="font-bold">{book.title}</h2>
                            <h3 className="text-slate-500">{book.author}</h3>
                        </div>
                    </div></Link>
                }) : <div className="flex flex-col h-80 w-full justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#62748e"><path d="M479.98-280q14.02 0 23.52-9.48t9.5-23.5q0-14.02-9.48-23.52t-23.5-9.5q-14.02 0-23.52 9.48t-9.5 23.5q0 14.02 9.48 23.52t23.5 9.5ZM453-433h60v-253h-60v253Zm27.27 353q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg>
                        <p className="text-slate-500">No results</p>
                    </div> ) : null}
        </div>
    </div>
}