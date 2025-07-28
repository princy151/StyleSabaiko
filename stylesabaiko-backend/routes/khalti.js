const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/khalti", async (req, res) => {
  console.log("Received body:", req.body);
  try {
    const {
      amount,
      order_id,
      order_name,
      name,
      phone,
      email,
      subtotal,
      vat,
      products,
    } = req.body;

    const payload = {
      return_url: "https://localhost:3000/",  
      website_url: "https://localhost:3000",                
      amount: amount,
      purchase_order_id: order_id,
      purchase_order_name: order_name,
      customer_info: {
        name,
        phone,
        email: email || "",
      },
      amount_breakdown: [
        { label: "Subtotal", amount: subtotal || amount },
        { label: "VAT", amount: vat || 0 },
      ],
      product_details: products || [],
    };

    const khaltiResponse = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: "Key 6fa778cd3be54fbcb62eaf35b71c0ae8", // Use env variable in production!
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(khaltiResponse.data);
  } catch (error) {
    console.error("Khalti Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Khalti payment initiation failed", error: error.response?.data });
  }
});

module.exports = router;
