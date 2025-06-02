import React from "react";

const AboutUs = () => {
  return (
    <section className="py-5" style={{ backgroundColor: "#222831", color: "#fff" }}>
      <div className="container d-flex flex-column flex-md-row align-items-center">
        {/* Text */}
        <div className="text-container mb-4 mb-md-0 me-md-4" style={{ flex: 1 }}>
          <h2 className="font-heading display-5 mb-3">We Are Good Here</h2>
          <p className="lh-lg">
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even slightly
            believable. If you are going to use a passage of Lorem Ipsum, you
            need to be sure there isn't anything embarrassing hidden in the
            middle of text.
          </p>
        </div>

        {/* Image */}
        <div className="image-container" style={{ flex: 1 }}>
          <img
            src="/about-img.png"
            alt="About us"
            className="img-fluid rounded"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
