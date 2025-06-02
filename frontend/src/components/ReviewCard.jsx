import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ReviewCard = ({ review }) => {
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<FaStar key={i} color="#ffc107" />);
            } else if (rating >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
            } else {
                stars.push(<FaRegStar key={i} color="#ffc107" />);
            }
        }
        return stars;
    };

    return (
        <div className="review-card">
            <img src={review.avatar} alt={review.name} />
            <h5 className="mt-3 font-heading">{review.name}</h5>
            {/* <div className="star-rating d-flex gap-1"> */}
            <div className="star-rating d-flex gap-1 justify-content-center">
                {renderStars(review.rating)}
            </div>
            <p className="text-secondary fst-italic mt-2">“{review.quote}”</p>
        </div>
    );
};

export default ReviewCard;