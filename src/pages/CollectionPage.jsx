import { useParams } from "react-router";


export default function CollectionPage(){
    const {id} = useParams();
    return <>
        <h1>COllection Page {id}</h1>
    </>
}