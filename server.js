const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const Shipment = require('./models/Shipment'); // Fixed path
const { router: adminRouter, addLog } = require('./routes/admin');
const apiRouter = require('./routes/api');

const app = express();

// Debug logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB with error handling
try {
    connectDB();
} catch (error) {
    console.error('MongoDB connection failed:', error);
}

// UltraMsg configuration
const instanceId = "instance148316";
const token = "2vcee05gb8ezth9y";
const apiUrl = `https://api.ultramsg.com/${instanceId}/messages/chat`;

// Updated sendMessage function with better error handling
async function sendMessage(to, body) {
    try {
        console.log('Sending message to:', to);
        console.log('Message body:', body);
        
        const response = await axios.post(apiUrl, {
            token,
            to: to.replace(/[^0-9]/g, ''), // Keep only numbers
            body,
            priority: 10
        });
        
        console.log('✅ Message sent successfully');
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ WhatsApp send error:');
        console.error('Error message:', error.message);
        console.error('Response data:', error.response?.data);
        throw error;
    }
}

// Add routes
app.use('/admin', adminRouter);
app.use('/api', apiRouter);

// Update webhook to log requests
app.post("/webhook", async (req, res) => {
    try {
        console.log('Webhook received:', JSON.stringify(req.body, null, 2));
        // Log webhook data
        addLog(req.body);
        
        const msg = req.body;
        if (!msg?.data) {
            console.log('Invalid webhook data received');
            return res.sendStatus(400);
        }

        const from = msg.data.from;
        const text = msg.data.body?.trim()?.toLowerCase();

        console.log(`📩 Message from ${from}: ${text}`);

        // --- Main chatbot logic ---
  if (text === "hi" || text === "hello") {
    await sendMessage(
      from,
      `👋 Hello! Welcome to *OmTrans Logistics*.\n\nPlease choose an option:\n1️⃣ Track my shipment\n2️⃣ Book a new shipment\n3️⃣ Talk to support\n4️⃣ View recent updates`
    );
  }

  // 1️⃣ TRACK SHIPMENT
  else if (text === "1") {
    await sendMessage(from, "🔎 Please enter your shipment BL number (e.g., BL12345).");
  }

  // If user enters reference number
  else if (/BL\d+/i.test(text)) {
    const BL = text.toUpperCase();
    const shipment = await Shipment.findOne({ BLNo: BL });

    if (shipment) {
      await sendMessage(
        from,
        `✅ *Shipment Details:*\nBL No: ${shipment.BLNo}\nOrigin: ${shipment.origin}\nDestination: ${shipment.destination}\nStatus: ${shipment.status}\nVessel: ${shipment.vessel}\nETD: ${shipment.etd}\nETA: ${shipment.eta}`
      );
    } else {
      await sendMessage(from, `❌ No shipment found for *${BL}*. Please check your BLerence number.`);
    }
  }

  // 2️⃣ BOOK NEW SHIPMENT
  else if (text === "2") {
    await sendMessage(
      from,
      "📦 Please share your booking details in this format:\n\nOrigin - Destination - Cargo Type (FCL/LCL) - Date"
    );
  }

  // 3️⃣ SUPPORT
  else if (text === "3") {
    await sendMessage(
      from,
      "👩‍💼 Our support team will contact you shortly.\nYou can also email us at *support@omtrans.com*."
    );
  }

  // 4️⃣ RECENT UPDATES
  else if (text === "4") {
    const recent = await Shipment.find().sort({ lastUpdate: -1 }).limit(3);
    if (recent.length === 0) {
      await sendMessage(from, "📭 No recent shipments found.");
    } else {
      const updates = recent
        .map(
          s =>
            `📦 ${s.BLNo} → ${s.status}\nETA: ${s.eta}\n----------------`
        )
        .join("\n");
      await sendMessage(from, `📰 *Recent Shipment Updates:*\n${updates}`);
    }
  }

  // DEFAULT REPLY
  else {
    await sendMessage(
      from,
      "❓Sorry, I didn’t understand that.\nPlease reply with one of these options:\n1️⃣ Track my shipment\n2️⃣ Book a new shipment\n3️⃣ Talk to support\n4️⃣ View recent updates"
    );
  }

        res.sendStatus(200);
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server with error handling
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`💬 Webhook URL: http://localhost:${PORT}/webhook`);
    console.log(`✅ UltraMsg configured with instance: ${instanceId}`);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});
