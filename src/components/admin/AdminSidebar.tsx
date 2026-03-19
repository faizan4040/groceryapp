import Link from "next/link";
import { PlusCircle, List, ClipboardList } from "lucide-react";

const AdminSidebar = ({ onClick }: { onClick?: () => void }) => {
  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm hidden md:flex flex-col">
      <div className="p-4 font-bold text-lg border-b">
        Admin Panel
      </div>

      <nav className="flex-1 p-3 space-y-2">

        <p className="text-[10px] font-bold uppercase text-gray-400 px-2">
          Admin
        </p>

        <Link
          href="/admin/add-grocery"
          onClick={onClick}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50"
        >
          <PlusCircle size={16} className="text-green-600" />
          Add Grocery
        </Link>

        <Link
          href="/admin/view-grocery"
          onClick={onClick}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50"
        >
          <List size={16} className="text-green-600" />
          View Grocery
        </Link>

        <Link
          href="/admin/manage-orders"
          onClick={onClick}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50"
        >
          <ClipboardList size={16} className="text-green-600" />
          Manage Orders
        </Link>

      </nav>
    </aside>
  );
};

export default AdminSidebar;