"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Home,
  Newspaper,
  Settings,
  LogOut,
  TrendingUp,
  FileText,
  User as UserIcon,
  ChevronRight,
  MoreHorizontal,
  ChevronsUpDown,
  type LucideIcon,
  SquarePlus,
} from "lucide-react";
import { useAuth } from "@/lib/modules/auth/useAuth";
import Link from "next/link";
import Image from "next/image";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { Header } from "./Header";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { SettingsDialog } from "@/components/settings-dialog";
import { PostCreateDialog } from "@/components/common/PostCreateDialog";
import { useIsTablet, useIsMobile } from "@/hooks/use-mobile";

// Data cho navigation
const navData = {
  navMain: [
    {
      title: "Trang chủ",
      url: "/",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/",
        },
        {
          title: "Thống kê",
          url: "/stats",
        },
      ],
    },
    {
      title: "Tin tức",
      url: "/news",
      icon: Newspaper,
      items: [
        {
          title: "Tin mới nhất",
          url: "/news",
        },
        {
          title: "Tin nổi bật",
          url: "/news/featured",
        },
        {
          title: "Danh mục",
          url: "/news/categories",
        },
      ],
    },
    {
      title: "Khám phá",
      url: "/explore",
      icon: TrendingUp,
      items: [
        {
          title: "Xu hướng",
          url: "/explore/trending",
        },
        {
          title: "Phổ biến",
          url: "/explore/popular",
        },
      ],
    },
    {
      title: "Đăng bài",
      url: "/post",
      icon: SquarePlus,
      items: [
        {
          title: "Bài viết (Feed)",
          url: "/post/feed",
        },
        {
          title: "Bài báo (News)",
          url: "/post/news",
        },
      ],
    },
    {
      title: "Tin nhắn",
      url: "/messages",
      icon: FileText,
      items: [
        {
          title: "Hộp thư",
          url: "/messages",
        },
        {
          title: "Đã gửi",
          url: "/messages/sent",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Tin công nghệ",
      url: "/category/tech",
      icon: TrendingUp,
    },
    {
      name: "Tin thể thao",
      url: "/category/sports",
      icon: TrendingUp,
    },
    {
      name: "Tin giải trí",
      url: "/category/entertainment",
      icon: TrendingUp,
    },
  ],
};

// Component NavProjects
function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Danh mục</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <TrendingUp className="text-muted-foreground" />
                  <span>Xem danh mục</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TrendingUp className="text-muted-foreground" />
                  <span>Chia sẻ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>Thêm</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

// Component NavUser với logic hiện tại
function NavUser({
  user,
  setOpenConfirmLogout,
}: {
  user: any;
  setOpenConfirmLogout: (open: boolean) => void;
}) {
  const { isMobile } = useSidebar();
  const [openSettings, setOpenSettings] = React.useState(false);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.avatar || "https://picsum.photos/32"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.name || "Guest"}
                  </span>
                  <span className="truncate text-xs">
                    {user?.email || "Chưa đăng nhập"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.avatar || "https://picsum.photos/32"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.name || "Guest"}
                    </span>
                    <span className="truncate text-xs">
                      {user?.email || "Chưa đăng nhập"}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user?.id}`}>
                    <UserIcon />
                    Hồ sơ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenSettings(true)}>
                  <Settings />
                  Cài đặt
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOpenConfirmLogout(true)}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <SettingsDialog open={openSettings} setOpen={setOpenSettings} />
    </>
  );
}

// Component LoginButton
function LoginButton() {
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AuthDialog
          trigger={
            <SidebarMenuButton
              size="lg"
              tooltip="Đăng nhập"
              className="w-full justify-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-2"
            >
              <UserIcon className="h-4 w-4" />
              {state === "expanded" && <span>Đăng nhập</span>}
            </SidebarMenuButton>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// Component TeamSwitcher (Logo switcher)
function TeamSwitcher() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Image
                  src="https://picsum.photos/40"
                  alt="Logo"
                  className="h-6 w-6 rounded object-cover"
                  width={24}
                  height={24}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Hari News</span>
                <span className="truncate text-xs">Tin tức hàng ngày</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Ứng dụng
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border">
                <Image
                  src="https://picsum.photos/40"
                  alt="Logo"
                  className="h-6 w-6 rounded object-cover"
                  width={24}
                  height={24}
                />
              </div>
              Hari News
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// Thêm state mở dialog post feed ở SidebarWithContext
function SidebarWithContext({
  user,
  handleLogout,
  profileLoading,
}: {
  user: any;
  handleLogout: () => void;
  profileLoading: boolean;
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { setOpen } = useSidebar();
  const isTablet = useIsTablet();
  const isMobile = useIsMobile();
  React.useEffect(() => {
    if (isTablet && !isMobile) {
      setOpen(false);
    } else if (!isTablet && !isMobile) {
      setOpen(true);
    }
  }, [isTablet, isMobile, setOpen]);

  const [openConfirmLogout, setOpenConfirmLogout] = React.useState(false);
  const [openPostFeed, setOpenPostFeed] = React.useState(false);

  // Custom NavMain để handle click "Bài viết (Feed)"
  function NavMainWithPostDialog({ items }: { items: typeof navData.navMain }) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) =>
                      subItem.title === "Bài viết (Feed)" ? (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <button
                              type="button"
                              onClick={() => setOpenPostFeed(true)}
                              className="w-full text-left"
                            >
                              <span>{subItem.title}</span>
                            </button>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ) : (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMainWithPostDialog items={navData.navMain} />
        <NavProjects projects={navData.projects} />
      </SidebarContent>
      <SidebarFooter>
        {profileLoading ? (
          <Skeleton className="h-8 w-full rounded-md" />
        ) : user ? (
          <NavUser user={user} setOpenConfirmLogout={setOpenConfirmLogout} />
        ) : (
          <LoginButton />
        )}
      </SidebarFooter>
      <AlertDialog open={openConfirmLogout} onOpenChange={setOpenConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc muốn đăng xuất?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <PostCreateDialog open={openPostFeed} setOpen={setOpenPostFeed} />
    </Sidebar>
  );
}

// BottomNavBar cho mobile
function BottomNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 bg-sidebar text-sidebar-foreground border-t border-border md:hidden">
      <Link
        href="/"
        className="flex-1 flex flex-col items-center justify-center"
      >
        <Home className="h-5 w-5" />
        <span className="text-xs">Trang chủ</span>
      </Link>
      <Link
        href="/news"
        className="flex-1 flex flex-col items-center justify-center"
      >
        <Newspaper className="h-5 w-5" />
        <span className="text-xs">Tin tức</span>
      </Link>
      <Link
        href="/explore"
        className="flex-1 flex flex-col items-center justify-center"
      >
        <TrendingUp className="h-5 w-5" />
        <span className="text-xs">Khám phá</span>
      </Link>
      <Link
        href="/messages"
        className="flex-1 flex flex-col items-center justify-center"
      >
        <FileText className="h-5 w-5" />
        <span className="text-xs">Tin nhắn</span>
      </Link>
      <AuthDialog
        trigger={
          <button className="flex-1 flex flex-col items-center justify-center">
            <UserIcon className="h-5 w-5" />
            <span className="text-xs">Tài khoản</span>
          </button>
        }
      />
    </nav>
  );
}

export function AppSidebar({ children }: { children?: React.ReactNode }) {
  const { profile, logout, profileLoading } = useAuth();
  console.log(
    "🔍 ~ AppSidebar ~ src/components/layout/Sidebar.tsx:580 ~ profile:",
    profile
  );

  const handleLogout = () => {
    logout();
  };
  const isTablet = useIsTablet();
  const isMobile = useIsMobile();
  const collapsible = isMobile ? "offcanvas" : isTablet ? "icon" : "offcanvas";

  // Nếu đang loading profile lần đầu, chỉ render skeleton hoặc null để tránh render SidebarWithContext sớm
  if (profileLoading && !profile) {
    return (
      <SidebarProvider>
        <Sidebar variant="inset" collapsible={collapsible}>
          <SidebarHeader />
          <SidebarContent />
          <SidebarFooter className="p-4">
            <Skeleton className="h-8 w-full rounded-md" />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <Header />
          <main>{children}</main>
        </SidebarInset>
        <BottomNavBar />
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <SidebarWithContext
        user={profile}
        handleLogout={handleLogout}
        profileLoading={profileLoading}
        collapsible={collapsible}
      />
      <SidebarInset>
        <Header />
        <main>{children}</main>
      </SidebarInset>
      <BottomNavBar />
    </SidebarProvider>
  );
}
