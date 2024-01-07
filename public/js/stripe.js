/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

const stripe = Stripe(
  "pk_test_51OVfKLCZ15inHuG7tOFBuR13fpa8XU6z3XjEG3RkiWlMv3mph0wtaKDpWKYRdV5RF2ATqDKH2XueY24E5aCRghzX001fsT6FgL"
);

export const bookTour = async (tourId) => {
  try {
    // get checkout session
  const session = await axios(
    `/api/v1/bookings/checkout-session/${tourId}`
  );
  // create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })
  } catch (err) {
    showAlert('Error', err); 
  }
};
