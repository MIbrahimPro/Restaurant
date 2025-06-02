import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useCart } from "../context/CartContext";
import MenuCard from "../components/MenuCard";
import AboutUs from "../components/AboutUs";
import ReviewCard from "../components/ReviewCard";



// 2) Static reviews for Home (reuse under /reviews)
const sampleReviews = [
    {
        id: 1,
        name: "Alice Johnson",
        avatar: "/review/p(1).jpg",
        rating: 5,
        quote: "Best food in town! The burger was so juicy and delicious.",
    },
    {
        id: 2,
        name: "Emma Garcia",
        avatar: "/review/p(2).jpg",
        rating: 4.5,
        quote: "Pizza was fresh and crispy. Will definitely come back!",
    },
    {
        id: 3,
        name: "Daniel Kim",
        avatar: "/review/p(3).jpg",
        rating: 5,
        quote: "Amazing service and great ambiance. Highly recommend the salad.",
    },
];

const Home = () => {
    const navigate = useNavigate();

    const { addToCart } = useCart();



    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchRandomItems = async () => {
            try {
                const response = await axios.get('/items/random');
                console.log(response);
                setItems(response.data);
            } catch (err) {
                console.error("Error fetching random items:", err);
            }
        };

        fetchRandomItems();
    }, []);



    return (
        <div>
            {/* Hero Section */}
            <section
                className="hero d-flex align-items-center justify-content-flex-start text-left"
                style={{ backgroundImage: `url('/hero-bg.jpg')` }}
            >
                <div className="hero-overlay"></div>
                {/* Add a Bootstrap container here */}
                <div className="container hero-content-container">
                    <div className="hero-content">
                        <h1 className="display-4 font-heading mb-3">Fast Food Restaurant</h1>
                        <p className="lead mb-4">
                            Doloremque, itaque aperiam facilis rerum, commodi, temporibus sapiente
                            ad mollitia laborum quam quisquam esse error unde. Tempora ex
                            doloremque, labore, sunt repellat dolore, iste magni quos nihil ducimus
                            libero ipsam.
                        </p>
                        <button
                            className="btn"
                            style={{ backgroundColor: "#ffbe33", color: "#222831" }}
                            onClick={() => navigate("/menu")}
                        >
                            Order Now
                        </button>
                    </div>
                </div>
            </section>
            {/* Horizontal scroll of favorites */}
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center font-heading mb-4">Our Favorites</h2>
                    <div className="d-flex overflow-auto pb-3">
                        {items.map((item) => (
                            <div key={item.name} className="me-3" style={{ minWidth: "280px" }}>
                                <MenuCard item={item} onAdd={() => addToCart(item)} />
                            </div>
                        ))}
                        <div style={{ minWidth: "280px" }} className="d-flex align-items-center justify-content-center">
                            <button
                                className="btn btn-outline-dark"
                                onClick={() => navigate("/menu")}
                            >
                                View More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us */}
            <div  style={{ paddingTop: '8rem', paddingBottom: '8rem', background: '#222831'}}>
                <AboutUs />
            </div>
            {/* Reviews Preview */}
            <section className="bg-light" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
                <div className="container">
                    <h2 className="text-center font-heading mb-4">What People Say</h2>
                    <div className="row g-4">
                        {sampleReviews.map((rev) => (
                            <div key={rev.id} className="col-md-4">
                                <ReviewCard review={rev} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
