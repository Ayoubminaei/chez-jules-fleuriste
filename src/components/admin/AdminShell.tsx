import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminShell({
  user,
  children,
}: {
  user: { email: string | null };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[color:var(--color-bg)] flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar user={user} />
        <div className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
