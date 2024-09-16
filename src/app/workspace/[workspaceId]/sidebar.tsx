import { usePathname } from "next/navigation";
import { UserButton } from "@/features/auth/components/user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        lable="Home"
        isActive={pathname.includes("/workspace")}
      />
      <SidebarButton
        icon={MessagesSquare}
        lable="DMs"
        isActive={pathname.includes("/DMs")}
      />
      <SidebarButton
        icon={Bell}
        lable="Activity"
        isActive={pathname.includes("/Activity")}
      />
      <SidebarButton
        icon={MoreHorizontal}
        lable="More"
        isActive={pathname.includes("/More")}
      />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};
