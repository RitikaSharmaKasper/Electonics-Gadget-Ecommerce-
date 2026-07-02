import {
  UserRound,
  List,
  Package,
  Heart,
  MapPinHouse,
  Headset,
  Star,
  LogOut,
  LogIn,
  ChevronRight,
  X,
  Component,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";

// Account Menu Items
const accountDetails = [
  { listName: "Account Details", listIcon: List, path: "/details" },
  { listName: "Orders", listIcon: Package, path: "/order-history" },
  { listName: "Wishlist", listIcon: Heart, path: "/wishlist" },
  { listName: "Manage Addresses", listIcon: MapPinHouse, path: "/addresses" },
  { listName: "Support & Help", listIcon: Headset, path: "/support" },
  { listName: "Rating & Reviews", listIcon: Star, path: "/reviews" },
  // { listName: "Reward Points" ,listIcon: Component , path: "/reward"}a
];

function UserProfile({ setIsProfileOpen }) {
  //  Redux state
  const { user, isAuthenticated } = useSelector((state) => state.user);

  return (
    <div className="h-max md:w-[413px] sm:w-[350px] w-[280px] overflow-hidden mx-auto bg-white z-50 ">
      {/* Top section: user icon and welcome message */}
      <div className="flex gap-4 items-center px-4 py-5 border-b border-gray-200 cursor-default">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f5dccc] flex items-center justify-center">
            {user ? (
              <img
                src={user?.user?.profileImage?.url}
                alt="UserImage"
                className=" rounded-full"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserRound size={20} className="text-[#0f6668]" />
            )}
          </div>
          <div>
            
            <p className="font-medium text-gray-700  font-playpen-sans
            " >
              {user?.user?.name || "Guest User"}
            </p>
            <p className="text-[15px] text-[#126B6D] font-playpen-sans">
              {isAuthenticated ? "Welcome back!" : "Please log in"}
            </p>
          </div>
        </div>
      </div>

      {/* List of Account Sections */}
      {isAuthenticated && (
        <div className="py-2 px-4">
          {accountDetails.map(({ listName, listIcon: Icon, path }) => (
            <NavLink
              key={listName}
              to={`/accounts${path}`}
              onClick={() => {
                setTimeout(() => {
                  // setIsProfileOpen(false);
                }, 0);
              }}
              className={({ isActive }) =>
                `flex items-center gap-4 p-1.5 my-1 rounded-lg duration-200 group ${
                  isActive ? "bg-[#88D3D5]/50 " : "hover:bg-[#88D3D5]/10 "
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-lg ${
                      isActive ? "bg-[#F0EEFF]" : "bg-[#F0EEFF]"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#454653] font-playpen-sans" />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-normal text-[16px] font-playpen-sans text-gray-600">
                      {listName}
                    </h2>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
