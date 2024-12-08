import { loadStripe } from '@stripe/stripe-js';
import { api } from '../api/apiClient';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export const stripeService = {
  // Initialize payment for subscription
  createSubscription: async (priceId) => {
    try {
      const { data } = await api.payment.createSubscription({ priceId });
      const stripe = await stripePromise;
      
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  // Handle one-time payments
  createPayment: async (amount, currency = 'usd') => {
    try {
      const { data } = await api.payment.createPaymentIntent({
        amount,
        currency
      });
      
      const stripe = await stripePromise;
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        data.clientSecret
      );

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Manage subscription
  updateSubscription: async (subscriptionId, newPriceId) => {
    try {
      const { data } = await api.payment.updateSubscription({
        subscriptionId,
        newPriceId
      });
      return data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const { data } = await api.payment.cancelSubscription(subscriptionId);
      return data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },

  // Get subscription status
  getSubscriptionStatus: async () => {
    try {
      const { data } = await api.payment.getSubscriptionStatus();
      return data;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const { data } = await api.payment.getPaymentHistory();
      return data;
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw error;
    }
  }
}; 