import { MdSpaceDashboard } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { TbPaperBag } from "react-icons/tb";
import { GiFruitBowl } from "react-icons/gi"; 
import {
        ADMIN_DASHBOARD, 
        ADMIN_GROCERY_ADD, 
        ADMIN_GROCERY_SHOW, 
        ADMIN_PRODUCT_ADD, 
        ADMIN_PRODUCT_SHOW
     } from "../../routes/AdminPanelRoute";


export const adminSidebarMenu = [
  {
    title: "Dashboard",
    url: ADMIN_DASHBOARD,
    icon: MdSpaceDashboard,
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

  // Existing Product Section
  {
    title: "Product",
    url: "#",
    icon: IoShirtOutline,
    submenu: [
      {
        title: "Add Product",
        url: ADMIN_PRODUCT_ADD,
      },
      {
        title: "All Products",
        url: ADMIN_PRODUCT_SHOW,
      },
    ],
  },

  {
    title: "Category",
    url: "#",
    icon: BiCategory,
    submenu: [
      {
        title: "Add Category",
        url: ADMIN_PRODUCT_ADD,
      },
      {
        title: "All Category",
        url: ADMIN_PRODUCT_SHOW,
      },
    ],
  },

  {
    title: "Orders",
    url: "#",
    icon: TbPaperBag,
    submenu: [
      {
        title: "All Orders",
        url: "/admin/orders",
      },
    ],
  },


];