import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch services
    axios.get("http://localhost:5000/api/services")
      .then(res => setServices(res.data))
      .catch(err => console.error(err));

    // Fetch bookings for user_id=1 (demo)
    axios.get("http://localhost:5000/api/bookings/1")
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Available Services</h2>
      <ul>
        {services.map(service => (
          <li key={service.id}>
            <strong>{service.name}</strong> - {service.description}
          </li>
        ))}
      </ul>

      <h2>My Bookings</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            {booking.product} - {booking.quantity} pcs (Booked on {new Date(booking.created_at).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
