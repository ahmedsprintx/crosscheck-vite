import client from 'api/axios-config';

export const getBillingDetails = () => {
  return client.get('/api/stripe/billing-section');
};
export const updateSubscription = (body) => {
  return client.post('/api/stripe/update-subscription', body);
};
export const cancelSubscription = () => {
  return client.put('/api/stripe/cancel-subscription');
};
export const buyReleaseSeats = (body) => {
  return client.put('/api/stripe/buy-or-release-seats', body);
};
