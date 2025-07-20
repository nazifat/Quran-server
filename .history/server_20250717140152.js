// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const store_id = process.env.SSLC_STORE_ID;
const store_passwd = process.env.SSLC_STORE_PASS;
const is_live = false; // true for production

app.post("/create-payment", async (req, res) => {
  const { amount, customerName, customerEmail } = req.body;

  const data = {
    store_id,
    store_passwd,
    total_amount: amount,
    currency: "BDT",
    tran_id: `TRX-${Date.now()}`,
    success_url: "http://localhost:5173/payment-success",
    fail_url: "http://localhost:5173/payment-fail",
    cancel_url: "http://localhost:5173/payment-cancel",
    cus_name: customerName || "Anonymous",
    cus_email: customerEmail || "anonymous@example.com",
    cus_add1: "Dhaka",
    cus_phone: "017XXXXXXXX",
    product_name: "Donation",
    product_category: "Donation",
    product_profile: "non-physical-goods",
  };

  const url = is_live
    ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
    : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

  try {
    const response = await axios.post(url, data);
    if (response.data?.GatewayPageURL) {
      res.send({ url: response.data.GatewayPageURL });
    } else {
      res.status(500).send({ error: "Failed to get payment URL" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SSLCommerz server running on port ${PORT}`);
});
