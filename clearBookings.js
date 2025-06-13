const mongoose = require("mongoose");
const Booking = require("./models/booking");

async function clearAllBookings() {
  try {
    await mongoose.connect("mongodb+srv://reshooomar50:1010abab@omarreshoo.wofur9v.mongodb.net/?retryWrites=true&w=majority&appName=omarreshoo");

    const result = await Booking.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} bookings.`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error deleting bookings:", error);
  }
}

clearAllBookings();
