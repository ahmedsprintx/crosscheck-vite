import {
  buyReleaseSeats,
  cancelSubscription,
  getBillingDetails,
  updateSubscription,
} from 'api/v1/payment/payment';
import { useMutation, useQuery } from 'react-query';

export const useGetBillingDetails = () => {
  return useQuery({
    queryKey: 'getBillingDetails',
    queryFn: getBillingDetails,
    refetchOnWindowFocus: false,
  });
};
export const useUpdateSubscription = () => {
  return useMutation(updateSubscription);
};
export const useCancelSubscription = () => {
  return useMutation(cancelSubscription);
};
export const useBuyReleaseSeats = () => {
  return useMutation(buyReleaseSeats);
};
