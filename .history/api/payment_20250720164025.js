import SSLCommerzPayment from 'sslcommerz-lts';

export default async function handler(req, res) {
    // Allow CORS for your frontend domain
    const allowedOrigins = ['https://quran-mazeed.netlify.app', 'http://localhost:5173'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
        res.setHeader('Access-Control-Allow-Origin', '*');


    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { amount, customerName, customerEmail } = req.body;

        const data = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: 'QURAN_' + Date.now(), // unique transaction id
            success_url: 'https://quran-mazeed.netlify.app/success',
            fail_url: 'https://quran-mazeed.netlify.app/fail',
            cancel_url: 'https://quran-mazeed.netlify.app/cancel',
            //   ipn_url: 'https://your-backend.vercel.app/api/ipn', // optional

            shipping_method: 'No',
            product_name: 'Donation',
            product_category: 'Donation',
            product_profile: 'general',


            cus_name: customerName || "Anonymous",
            cus_email: customerEmail || "no-reply@example.com",

            cus_add1: 'Dhaka',
            cus_city: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
        };

        const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWD, false); // false = sandbox

        try {
            const apiResponse = await sslcz.init(data);
            return res.status(200).json({ url: apiResponse.GatewayPageURL });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Payment initiation failed' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
