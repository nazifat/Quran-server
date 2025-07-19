// api/payment.js
const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const {
    amount,
    customerName = "Anonymous",
    customerEmail = "anonymous@example.com",
  } = req.body;

  const store_id = process.env.SSLC_STORE_ID;
  const store_passwd = process.env.SSLC_STORE_PASS;
  const is_live = false;

  const data = {
    store_id,
    store_passwd,
    total_amount: amount,
    currency: "BDT",
    tran_id: `TRX-${Date.now()}`,
    success_url: "https://your-netlify-frontend.netlify.app/payment-success",
    fail_url: "https://your-netlify-frontend.netlify.app/payment-fail",
    cancel_url: "https://your-netlify-frontend.netlify.app/payment-cancel",
    cus_name: customerName,
    cus_email: customerEmail,
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
    res.status(200).json({ url: response.data.GatewayPageURL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
