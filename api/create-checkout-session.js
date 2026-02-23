const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Resume Download" },
            unit_amount: 200, // $2.00
          },
          quantity: 1,
        },
      ],
      success_url: "https://yourproject.vercel.app/success.html?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://yourproject.vercel.app/index.html",
    });

    res.status(200).json({ id: session.id });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};