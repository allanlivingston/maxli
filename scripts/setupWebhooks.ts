import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookUrl = process.env.WEBHOOK_URL; // e.g., 'https://your-domain.com/api/webhook'

async function setupWebhook() {
  if (!webhookUrl) {
    console.error('WEBHOOK_URL is not defined in the environment variables.');
    process.exit(1);
  }

  try {
    // List all webhook endpoints
    const webhooks = await stripe.webhookEndpoints.list();

    // Check if our webhook already exists
    const existingWebhook = webhooks.data.find(webhook => webhook.url === webhookUrl);

    if (existingWebhook) {
      console.log('Webhook already exists. Updating...');
      const updatedWebhook = await stripe.webhookEndpoints.update(existingWebhook.id, {
        enabled_events: ['checkout.session.completed'],
      });
      console.log('Webhook updated:', updatedWebhook);
    } else {
      console.log('Creating new webhook...');
      const newWebhook = await stripe.webhookEndpoints.create({
        url: webhookUrl,
        enabled_events: ['checkout.session.completed'],
      });
      console.log('New webhook created:', newWebhook);
      console.log('Webhook Secret:', newWebhook.secret);
    }
  } catch (error) {
    console.error('Error setting up webhook:', error);
  }
}

setupWebhook();
