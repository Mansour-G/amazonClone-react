import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import CheckOutProduct from "../components/CheckOutProduct";
import Header from "../components/Header";
import { selectItems, selectTotal } from "../slices/basketSlice";
import Currency from "react-currency-formatter";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51LjPrAAocApQapQDVbDlfQ5vjZnJrSMvTaDHTtFMb7hvF1gXwB3xMFAnGFO7OuaHkRU6gpJDbPkJTJY3SNFtLHma001uLw1tPG"
);

const checkout = () => {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const { data: session } = useSession();

  const createCheckoutSession = async () => {
    const stripe = await stripePromise;

    // call the bakend to create the checkout session
    const checkoutSession = await axios.post("/api/create-stripe-session", {
      items: items,
      email: session.user.email,
    });

    //Redirect user to checkout session / Stripe checkout
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    console.log(result);

    if (result.error) alert(result.error.message);
  };

  return (
    <div className="bg-gray-100 ">
      <Header />

      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* left section */}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={250}
            objectFit={"contain"}
          />

          <div className="flex flex-col p-5 space-y-10 bg-white shadow-md">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0 ? "Your Basket is Empty" : "Shopping Basket"}
            </h1>

            {items.map((item, i) => (
              <CheckOutProduct
                key={i}
                id={item.id}
                image={item.image}
                price={item.price}
                rating={item.rating}
                title={item.title}
                hasPrime={item.hasPrime}
                category={item.category}
                description={item.description}
              />
            ))}
          </div>
        </div>

        {/* right section */}
        <div className="flex flex-col bg-white p-10 ">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap ">
                Subtotal ({items.length}) items{" "}
                <span className="font-bold ">
                  <Currency quantity={total} currency="USD" />
                </span>
              </h2>

              {/* Stripe Checkout Button */}
              <button
                role="link"
                type="submit"
                disabled={!session}
                onClick={createCheckoutSession}
                className={`button mt-2 
                ${
                  !session &&
                  "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                {!session ? "Sign in to checkout" : "Proceed to checkout"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default checkout;
