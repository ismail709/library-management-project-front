import { useContext, useState } from "react";
import { AlertContext } from "../context/AlertContext";
import Alert from "./Alert";


export default function AlertContextProvider({children}){
    const [alert,setAlert] = useState(null);

    function showAlert(message,type="success",duration=3000){
        setAlert({message,type,duration});

        setTimeout(()=>{
            setAlert(null);
        },duration)
    }

    return <AlertContext.Provider value={{showAlert}}>
        {children}
        {alert && <Alert message={alert.message} type={alert.type} duration={alert.duration} />}
    </AlertContext.Provider>
}

export function useAlert(){
    return useContext(AlertContext);
}