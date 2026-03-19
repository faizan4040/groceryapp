import AdminLayout from "@/components/admin/AdminLayout";
import { auth } from "@/auth";

export default async function Layout({ children }: any) {
  const session = await auth();

  return (
    <AdminLayout user={session?.user}>
      {children}
    </AdminLayout>
  );
}