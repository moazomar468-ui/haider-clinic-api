const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// 🔗 رابط الاتصال بقاعدة البيانات السحابية (MongoDB Atlas)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://moazomar468_db_user:8tv4QUSOpbW9ZnSK@haiderclinicdb.xxxxx.mongodb.net/dr_haider_clinic?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ تم الاتصال بقاعدة البيانات السحابية بنجاح!"))
  .catch(err => console.error("❌ خطأ في الاتصال بقاعدة البيانات:", err));

// مخطط الحجوزات والمحادثات لنظام عيادة الأسنان
const BookingSchema = new mongoose.Schema({
  patientName: String,
  phone: String,
  type: String,
  symptoms: String,
  queueNumber: Number,
  status: { type: String, default: 'معلق' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', BookingSchema);

// APIs الخاصة بالموقع والحجوزات
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'خطأ في جلب البيانات' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const count = await Booking.countDocuments();
    const booking = new Booking({ ...req.body, queueNumber: count + 1 });
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: 'خطأ في حفظ الحجز' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));