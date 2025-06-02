import React from "react";
import ReviewCard from "../components/ReviewCard";
import AboutUs from "../components/AboutUs";

// // Static reviews
// const sampleReviews = [
//   {
//     id: 1,
//     name: "Alice Johnson",
//     avatar: "/review/p(1).jpg",
//     quote:
//       "Best food in town! The burger was so juicy and delicious.",
//   },
//   {
//     id: 2,
//     name: "Bob Williams",
//     avatar: "/review/p(2).jpg",
//     quote: "Pizza was fresh and crispy. Will definitely come back!",
//   },
//   {
//     id: 3,
//     name: "Catherine Lee",
//     avatar: "/review/p(3).jpg",
//     quote:
//       "Amazing service and great ambiance. Highly recommend the salad.",
//   },
//   {
//     id: 4,
//     name: "Daniel Kim",
//     avatar: "/review/p(4).jpg",
//     quote:
//       "Service was top-notch, and food arrived hot and fast.",
//   },
//   {
//     id: 5,
//     name: "Emma Garcia",
//     avatar: "/review/p(5).jpg",
//     quote: "Loved the vibes. Will bring friends next time!",
//   },
// ];


const sampleReviews = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/review/p(1).jpg",
    quote: "Best food in town! The burger was so juicy and delicious.",
    rating: 5,
  },
  {
    id: 2,
    name: "Emma Garcia",
    avatar: "/review/p(2).jpg",
    quote: "Pizza was fresh and crispy. Will definitely come back!",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Daniel Kim",
    avatar: "/review/p(3).jpg",
    quote: "Amazing service and great ambiance. Highly recommend the salad.",
    rating: 4,
  },
  {
    id: 4,
    name: "Catherine Lee",
    avatar: "/review/p(4).jpg",
    quote: "Service was top-notch, and food arrived hot and fast.",
    rating: 5,
  },
  {
    id: 5,
    name: "Bob Williams",
    avatar: "/review/p(5).jpg",
    quote: "Loved the vibes. Will bring friends next time!",
    rating: 4.5,
  },
];




const Reviews = () => {
  return (
    <div>
      <section className="py-5">
        <div className="container">
          <h2 className="text-center font-heading mb-4">Reviews</h2>
          <div className="row g-4">
            {sampleReviews.map((rev) => (
              <div key={rev.id} className="col-sm-6 col-md-4">
                <ReviewCard review={rev} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reuse AboutUs at bottom */}
      <AboutUs />
    </div>
  );
};

export default Reviews;
 