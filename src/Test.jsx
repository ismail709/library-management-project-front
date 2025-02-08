import { useQueries, useQuery } from "@tanstack/react-query"
import { axiosClient } from "./api/axios"


async function fetchCategories(){
    return (await axiosClient.get("/categories")).data;
}

async function fetchBooks(category) {
    return (await axiosClient.get("/books/c/"+category)).data;
}

async function fetchFeaturedCategories(){
    return (await axiosClient.get("/categories/featured")).data;
}


export default function Test(){
    const query = useQuery({
        queryKey: ["test"],
        queryFn: fetchFeaturedCategories
    })
    const queries = useQueries({
        queries: query.data ? query.data.map((category,i) => {
            return {
                queryKey: ["books",{category}],
                queryFn: () => fetchBooks(category.id)
            }
        }) : []
    })
    console.log(query);
    return <>test</>
}