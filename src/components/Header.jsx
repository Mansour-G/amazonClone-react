import React from "react";
import Image from "next/legacy/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

import { MenuIcon, SearchIcon, ShoppingCartIcon } from "@heroicons/react/solid";
import { selectItems } from "../slices/basketSlice";
import { useSelector } from "react-redux";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const items = useSelector(selectItems);

  return (
    <header>
      {/* Top Nav */}
      <div className="flex items-center bg-amazon_blue p-1 flex-grow py-2">
        <div className="mt-2 flex items-centre flex-grow sm:flex-grow-0">
          <Image
            onClick={() => router.push("/")}
            src="https://links.papareact.com/f90"
            width={150}
            height={40}
            objectFit="contain"
            className="cursor-pointer "
          />
        </div>

        {/* Search */}
        <div className="hidden sm:flex items-center h-10 rounded-md flex-grow  bg-yellow-400 hover:bg-yellow-500 cursor-pointer">
          <input
            className="p-2 h-full w-6 flex-grow rounded-md flex-shrink focus:outline-none px-4"
            type="text"
          />
          <SearchIcon className="h-12 p-4" />
        </div>

        <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
          <div onClick={!session ? signIn : signOut} className="link">
            {session ? `Hello , ${session.user.name}` : "Sign In"}
            <p className="font-extrabold md:text-sm">account & list</p>
          </div>

          <div className="link" onClick={() => router.push("/orders")}>
            <p>returns</p>
            <p className="font-extrabold md:text-sm">&orders</p>
          </div>

          <div
            onClick={() => router.push("/checkout")}
            className="reletive link flex items-center"
          >
            <span className="absolute top-0 right-0 md:right-16 md:top-3 h-4 w-4 bg-yellow-400 text-center rounded-full font-bold text-black">
              {items.length}
            </span>
            <ShoppingCartIcon className="h-8" />
            <p className="hidden md:inline font-extrabold md:text-sm mt-2">
              basket
            </p>
          </div>
        </div>
      </div>

      {/* Bottme Nav */}
      <div className="flex items-center space-x-3 bg-amazon_blue-light text-white text-sm">
        <p className="link flex items-center">
          <MenuIcon className="h-6 mr-1" />
          All
        </p>
        <p className="link ">Prime Video</p>
        <p className="link ">Amazon Business</p>
        <p className="link ">Today's Deals</p>
        <p className="link hidden lg:inline-flex">Electronics</p>
        <p className="link hidden lg:inline-flex">Food & Grocery</p>
        <p className="link hidden lg:inline-flex">Prime</p>
        <p className="link hidden lg:inline-flex">Buy Again</p>
        <p className="link hidden lg:inline-flex">Shopper tolkit</p>
        <p className="link hidden lg:inline-flex">Health & Personal Care</p>
      </div>
    </header>
  );
};

export default Header;
