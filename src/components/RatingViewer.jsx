import star from "../assets/star.png"
import emptyStar from "../assets/empty_star.png"

export default function RatingViewer({rating}){
    
  const MAX_RATING = 5;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= MAX_RATING; i++) {
      const src = i <= rating ? star : emptyStar;

      stars.push(
        <img
          key={i}
          src={src}
          alt={i <= rating ? "Filled Star" : "Empty Star"}
          className={`w-4 h-4 object-contain ${i <= rating ? "opacity-100" : "opacity-50"}`} // Add a class for styling
        />
      );
    }
    return stars;
  };


  return (
    <div className="flex gap-1">
      {renderStars()}
    </div>
  );
};