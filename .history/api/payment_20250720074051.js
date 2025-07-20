import SSLCommerzPayment from 'sslcommerz-lts';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount, customerName, customerEmail } = req.body;

    const data = {
      total_amount: amount,
      currency: 'BDT',
      tran_id: 'QURAN_' + Date.now(), // unique transaction id
      success_url: 'https://your-frontend.netlify.app/success',
      fail_url: 'https://your-frontend.netlify.app/fail',
      cancel_url: 'https://your-frontend.netlify.app/cancel',
      ipn_url: 'https://your-backend.vercel.app/api/ipn', // optional

      shipping_method: 'No',
      product_name: 'Donation',
      product_category: 'Donation',
      product_profile: 'general',

      cus_name: customerName,
      cus_email: customerEmail,
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: '01711111111',
    };

    const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWD, false); // false = sandbox

    try {
      const apiResponse = await sslcz.init(data);
      return res.status(200).json({ GatewayPageURL: apiResponse.GatewayPageURL });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Payment initiation failed' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
