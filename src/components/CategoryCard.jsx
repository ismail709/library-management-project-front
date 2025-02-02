import { Link } from "react-router";
import { motion } from "motion/react";


export default function CategoryCard({ category }) {
    if (!category) {
      return (
        <div className="p-4 bg-white shadow-lg rounded-sm animate-pulse w-60 h-40">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mt-2"></div>
        </div>
      );
    }
  
    const { name, description,id} = category;
  
    return (
        <Link className="" to={`/c/${id}`}>
      <motion.div 
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 },
      }} 
      className="p-4 bg-white shadow-lg rounded-sm min-h-40 hover:bg-amber-400 hover:text-white">
        <h3 className="text-xl font-semibold capitalize">{name}</h3>
        <p className="mt-2">{description}</p>
      </motion.div>
      </Link>
    );
  }
  