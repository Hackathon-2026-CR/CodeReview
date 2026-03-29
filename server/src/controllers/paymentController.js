const userDal = require("../dal/userDal");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const packages = {
  starter: { credits: 50, price: 500 }, // $5
  basic: { credits: 120, price: 1000 }, // $10
  pro: { credits: 300, price: 2000 }, // $20
  elite: { credits: 1000, price: 5000 }, // $50
};

const createCheckout = async (req, res) => {
  try {
    const { username, package: packageName } = req.body;
    if (!username || !packageName || !packages[packageName]) {
      return res.status(400).json({ error: "Invalid username or package" });
    }

    const selectedPackage = packages[packageName];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${selectedPackage.credits} CodeReview Credits (${packageName})`,
            },
            unit_amount: selectedPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?credits=${selectedPackage.credits}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        username,
        credits: selectedPackage.credits.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    // Note: express.raw() needs to provide req.body as a Buffer.
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { username, credits } = session.metadata;

    try {
      const user = await userDal.findByName(username);
      if (user) {
        await userDal.updateByName(username, {
          credits: user.credits + parseInt(credits, 10),
        });
        console.log(
          `Successfully added ${credits} credits to user ${username}`,
        );
      } else {
        console.error(
          `User ${username} not found for webhook credits addition`,
        );
      }
    } catch (err) {
      console.error("Error updating user credits in DB:", err);
    }
  }

  res.status(200).send("OK");
};

module.exports = { createCheckout, handleWebhook };
