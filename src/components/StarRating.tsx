import React, { useState } from "react";

interface StarRatingProps {
  initialRating?: number;
  onRatingChange: (rating: number) => void;
  readOnly?: boolean;
  size?: "small" | "medium" | "large";
}

const StarRating: React.FC<StarRatingProps> = ({
  initialRating = 0,
  onRatingChange,
  readOnly = false,
  size = "medium",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayStarFillRating = hoverRating || initialRating;

  const starSizeClass = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6",
  }[size];

  const handleStarClick = (ratingValue: number) => {
    if (!readOnly) {
      if (ratingValue === initialRating) {
        onRatingChange(0);
        setHoverRating(0);
      } else {
        onRatingChange(ratingValue);
      }
    }
  };

  const handleMouseEnter = (ratingValue: number) => {
    if (!readOnly) {
      setHoverRating(ratingValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <svg
          key={starValue}
          className={`${starSizeClass} ${
            starValue <= displayStarFillRating
              ? "text-yellow-400"
              : "text-gray-300"
          } ${
            !readOnly ? "cursor-pointer" : ""
          } transition-colors duration-200`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
          onMouseLeave={handleMouseLeave}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
