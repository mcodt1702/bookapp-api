function makeTestBookings() {
  return [
    {
      users_id: 1,
      venue_id: 1,
      booking_date: "2020-10-22",
      status: "open",
    },
  ];
}

module.exports = { makeTestBookings };
