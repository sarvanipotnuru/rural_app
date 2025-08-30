import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* ✅ Our Services Section */}
      <section id="services">
        <h2>Our Services</h2>
        <div className="grid">
          <div className="card">🚜 Farming Equipment Rental</div>
          <div className="card">🐄 Veterinary Services</div>
          <div className="card">💧 Water Supply</div>
          <div className="card">🛒 Market Access</div>
          <div className="card">🚚 Transport</div>
        </div>
      </section>

      {/* ✅ Products Section */}
      <section id="products">
        <h2>Available Products</h2>
        <div className="grid">
          <div className="card">🌾 Rice - ₹40/kg</div>
          <div className="card">🥛 Milk - ₹50/L</div>
          <div className="card">🍞 Bread - ₹30</div>
          <div className="card">🧈 Butter - ₹60</div>
          <div className="card">🥔 Potatoes - ₹25/kg</div>
          <div className="card">🍅 Tomatoes - ₹35/kg</div>
        </div>
      </section>

      {/* ✅ News Section */}
      <section id="news">
        <h2>News & Updates</h2>
        <ul>
          <li>🌱 Government launches new irrigation scheme</li>
          <li>🚜 Tractor rental prices reduced for farmers</li>
          <li>🩺 Free veterinary camp this Sunday</li>
        </ul>
      </section>

      {/* ✅ Contact Section */}
      <section id="contact">
        <h2>Contact Us</h2>
        <p>📍 Address: Rural Development Center, Village Road</p>
        <p>📞 Helpline: +91 9876543210</p>
        <form>
          <input type="text" placeholder="Your Name" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit">Send</button>
        </form>
      </section>

    </div>
  );
}

export default Home;
