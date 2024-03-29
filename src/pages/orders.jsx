import React from "react";
import Header from "../components/Header";
import moment from "moment";
import app from "../../firebase";
import { getSession, useSession } from "next-auth/react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import Order from "../components/Order";

const Orders = ({ orders }) => {
  const { data: session } = useSession();

  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10  ">
        <h1 className="text-3xl  border-b mb-2 pb-1 border-yellow-400 ">
          Your Orders
        </h1>

        {session ? (
          <h2>{orders?.length} Orders</h2>
        ) : (
          <h2>Please sign in to see your orders</h2>
        )}

        <div className="mt-5 space-y-4">
          {orders?.map(({ id, amount, images, timestamp, items }) => (
            <Order
              key={id}
              id={id}
              amount={amount}
              // amountShipping={amountShipping}
              items={items}
              timestamp={timestamp}
              images={images}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Orders;

export async function getServerSideProps(context) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  //Get the users logged in credentials...
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }

  // const db = getFirestore(app);
  const db = getFirestore(app);

  //firebase db
  const stripeOrders = await getDocs(
    collection(db, "users", session.user.email, "orders")
  );
  stripeOrders.forEach((doc) => {
    doc.data();
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
  });
  console.log(stripeOrders);

  // stripe orders
  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      images: order.data().images,
      // amountShipping: order.data().amount_shipping,
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: (
        await stripe.checkout.sessions.listLineItems(order.id, {
          limit: 100,
        })
      ).data,
    }))
  );

  return {
    props: {
      orders,
    },
  };
}
