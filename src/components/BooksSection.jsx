import { Link } from "react-router";
import BookCard from "./BookCard";


export default function BooksSection({query,title,to}){
    if(query.isSuccess && query.data.length == 0) return null;
    if(query.isSuccess && query.data.data.length < 5) return null;
    return <>
        <div className="flex justify-between border-b pb-2 border-slate-500 items-baseline">
            <h1 className="text-2xl font-bold capitalize">{title}</h1>
            <Link className="text-slate-500 hover:underline" to={to}>See more &gt;</Link>
        </div>
        <div className="flex gap-4 max-w-full overflow-x-scroll overflow-y-hidden p-4 custom-scrollbar">
            {query.isPending && new Array(10).fill(null).map((e,i) => <BookCard key={i} />)}
            {query.isSuccess && query.data.data.map((book,i) => <BookCard book={book} key={i} />)}
        </div>
    </>
}