import { MdSpaceDashboard } from "react-icons/md";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { TbPaperBag } from "react-icons/tb";
import { GiFruitBowl } from "react-icons/gi"; 
import { MdDeliveryDining } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";


import {
  ADMIN_ASSIGNORDERS,
  ADMIN_CATEGORY_ADD,
        ADMIN_CATEGORY_SHOW,
        ADMIN_COUPONS_ADD,
        ADMIN_COUPONS_SHOW,
        ADMIN_DASHBOARD, 
        ADMIN_DELIVERY_SHOW, 
        ADMIN_GROCERY_ADD, 
        ADMIN_GROCERY_SHOW,
        ADMIN_MANAGEORDERS_SHOW,
        ADMIN_PAYMENT_SHOW,
        ADMIN_REVIEWS_SHOW,
        ADMIN_TRACKING, 
     } from "../../routes/AdminPanelRoute";


export const adminSidebarMenu = [
  {
    title: "Dashboard",
    url: ADMIN_DASHBOARD,
    icon: MdSpaceDashboard,
  },


  {
    title: "Category",
    url: "#",
    icon: MdOutlineLocalGroceryStore,
    submenu: [
      {
        title: "Add Category",
        url: ADMIN_CATEGORY_ADD,
      },
      {
        title: "All Category",
        url: ADMIN_CATEGORY_SHOW,
      },
    ],
  },


  {
    title: "Grocery",
    url: "#",
    icon: GiFruitBowl,
    submenu: [
      {
        title: "Add Grocery",
        url: ADMIN_GROCERY_ADD,
      },
      {
        title: "View Grocery",
        url: ADMIN_GROCERY_SHOW,
      },
    ],
  },


  {
    title: "Orders",
    url: "#",
    icon: TbPaperBag,
    submenu: [
      {
        title: "Manage Orders",
        url: ADMIN_MANAGEORDERS_SHOW,
      },
      {
        title: "Stock Orders",
        url: ADMIN_MANAGEORDERS_SHOW,
      },
    ],
  },

  {
    title: "Delivery",
    url: "#",
    icon:  MdDeliveryDining,
    submenu: [
      {
        title: "Manage Delivery",
        url: ADMIN_DELIVERY_SHOW,
      },
      {
        title: "Assign Orders",
        url: ADMIN_ASSIGNORDERS,
      },
      {
        title: "Tracking",
        url: ADMIN_TRACKING,
      },
    ],
  },

  {
    title: "Coupons",
    url: "#",
    icon: RiCoupon2Line,
    submenu: [
      {
        title: "Add Coupons",
        url: ADMIN_COUPONS_ADD,
      },
      {
        title: "View Coupons",
        url: ADMIN_COUPONS_SHOW,
      },
    ],
  },

  {
    title: "Reviews",
    url: "#",
    icon: FaRegStar,
    submenu: [
      {
        title: "All Reviews",
        url: ADMIN_REVIEWS_SHOW,
      },
    ],
  },

  {
    title: "Payment",
    url: "#",
    icon: MdOutlinePayments,
    submenu: [
      {
        title: "Transactions",
        url: ADMIN_PAYMENT_SHOW,
      },
    ],
  },


];