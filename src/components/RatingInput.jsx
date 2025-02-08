import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import starFilled from "../assets/star.png";
import starEmpty from "../assets/empty_star.png";


const RatingInput = forwardRef((props,ref) => {
	const [rating, setRating] = useState(1);
	const [hoverRating, setHoverRating] = useState(0);
    const hoverTimeout = useRef(null);

	const handleStarClick = useCallback((newRating) => {
        clearTimeout(hoverTimeout.current);
        setHoverRating(0);
		setRating(newRating);
	}, []);
    
	const handleStarMouseEnter = useCallback((newRating) => {
        clearTimeout(hoverTimeout.current);
		setHoverRating(newRating);
	}, []);

	const handleStarMouseLeave = useCallback((newRating) => {
        hoverTimeout.current = setTimeout(()=>{
            setHoverRating(0);
        },200);
	}, []);

    useImperativeHandle(ref,()=>{
        return {
            reset: () => {
                setRating(1);
                setHoverRating(0);
            }
        }
    },[])

	const renderStars = () => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			const r = hoverRating || rating;
			const src = i <= r ? starFilled : starEmpty;
			stars.push(
				<img
					key={i}
					src={src}
					alt={i <= r ? "Filled Star" : "Empty Star"}
					className="w-8 h-8 object-contain"
					onClick={() => handleStarClick(i)}
					onMouseEnter={() => handleStarMouseEnter(i)}
					onMouseLeave={() => handleStarMouseLeave(i)}
				/>
			);
		}
		return stars;
	};

	return (
		<div className="flex gap-2 justify-center">
			{renderStars()}
			<input type="hidden" name="rating" value={rating} />
		</div>
	);
});

export default RatingInput;
