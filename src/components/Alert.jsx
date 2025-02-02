import { useEffect, useState } from "react";
import { motion } from "motion/react";


export default function Alert({ message, type = "info", duration = 3000, onClose }) {
    const [visible,setVisible] = useState(true);
    const typeStyles = {
      success: "bg-green-100 text-green-800 border-green-500",
      error: "bg-red-100 text-red-800 border-red-500",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-500",
      info: "bg-blue-100 text-blue-800 border-blue-500",
    };
    const typesFills = {
        success: "fill-green-800",
        error: "fill-red-800",
        warning: "fill-yellow-800",
        info: "fill-blue-800",
    }
  
    if(!visible) return null;
    return (
      <motion.div
        initial={{x:500}}
        animate={{x:[500,0,0,500]}}
        transition={{duration:duration/1000,ease:"easeInOut",times:[0,0.2,0.8,1]}}
        className={`fixed bottom-5 md:bottom-auto md:top-5 right-5 px-4 py-3 border-l-4 rounded shadow-lg flex items-center gap-2 ${typeStyles[type]}`}
      >
        <span>{message}</span>
        <button onClick={() => setVisible(false)} className="">
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" className={`${typesFills[type]}`}><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
        </button>
      </motion.div>
    );
  }