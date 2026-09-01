import 'dotenv/config';
import https from 'https';

const secretKey = process.env.PAYSTACK_TEST_KEY || process.env.PAYSTACK_SECRET_KEY;

console.log("Testing Paystack integration connection...");
console.log("Using key:", secretKey ? secretKey.substring(0,12) + "..." : "NO KEY FOUND");

const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/bank',
  method: 'GET',
  headers: {
    Authorization: `Bearer ${secretKey}`
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log("Response:", parsed.message || "Banks retrieved! Count: " + parsed.data?.length);
      if(res.statusCode === 200) {
        console.log("✅ PAYSTACK IS LIVE AND TALKING!");
      }
    } catch(e) {
      console.log("Response:", data);
    }
  });
});

req.on('error', error => {
  console.error("Connection Error:", error);
});

req.end();
