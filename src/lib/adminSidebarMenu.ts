import { MdSpaceDashboard } from "react-icons/md";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { TbPaperBag } from "react-icons/tb";
import { GiFruitBowl } from "react-icons/gi"; 
import {
  ADMIN_CATEGORY_ADD,
        ADMIN_CATEGORY_SHOW,
        ADMIN_DASHBOARD, 
        ADMIN_GROCERY_ADD, 
        ADMIN_GROCERY_SHOW,
        ADMIN_MANAGEORDERS_SHOW, 
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
    ],
  },


];