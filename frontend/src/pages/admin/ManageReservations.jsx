// ManageReservations Page
import React, { useState } from "react";
import ReservationTable from "../../components/admin/ReservationTable";

const ManageReservations = () => {

  const [reservations, setReservations] = useState([
    {
      id: 1,
      businessName: "ABC Publishers",
      stall: "A1",
      size: "Large",
      status: "PENDING"
    },
    {
      id: 2,
      businessName: "Book World",
      stall: "B3",
      size: "Medium",
      status: "APPROVED"
    },
  ]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Reservations</h2>

      <ReservationTable
        reservations={reservations}
        setReservations={setReservations}
      />
    </div>
  );
};

export default ManageReservations;
// ManageReservations Page
