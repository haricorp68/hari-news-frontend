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
  TrendingUp,
  SquarePlus,
  User as UserIcon,
  ChevronRight,
  PenTool,
  FileText,
  type LucideIcon,
  Home as House,
} from "lucide-react";
import { useAuth } from "@/lib/modules/auth/useAuth";
import { useAuthStore } from "@/lib/modules/auth/auth.store";
import Link from "next/link";
import Image from "next/image";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { PostCreateDialog } from "@/components/post/PostCreateDialog";
import { useIsTablet, useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";

export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_WIDTH_ICON = "3rem";

const getNavData = (isAuthenticated: boolean) => ({
  navMain: [
    {
      title: "Trang chủ",
      url: "/",
      icon: Home,
    },
    {
      title: "Tin tức",
      url: "/news",
      icon: Newspaper,
    },
    {
      title: "Khám phá",
      url: "/explore",
      icon: TrendingUp,
    },
    ...(isAuthenticated
      ? [
          {
            title: "Tạo",
            url: "/create",
            icon: SquarePlus,
            hasDropdown: true,
            items: [
              {
                title: "Bài viết (Feed)",
                action: "openPostFeed",
                icon: PenTool,
              },
              {
                title: "Bài báo (News)",
                url: "/news/create",
                icon: FileText,
              },
            ],
          },
        ]
      : []),
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
});

function NavUser({
  user,
}: {
  user: any;
  setOpenConfirmLogout: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            size="lg"
            className={`px-4 py-3 min-h-[56px] gap-3 ${
              pathname.startsWith(`/profile/${user.id}`)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : ""
            }`}
          >
            <Link
              href={user?.id ? `/profile/${user.id}` : "#"}
              className="w-full flex items-center justify-start"
            >
              <Avatar className="h-8 w-8 rounded-md">
                <AvatarImage
                  src={
                    user?.avatar ||
                    "https://res.cloudinary.com/haricorp/image/upload/v1754348466/Gemini_Generated_Image_1owgb01owgb01owg_knc0fr.png"
                  }
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="rounded-md text-xs">
                  {user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium text-sm">
                  {user?.name || "Guest"}
                </span>
                <span className="truncate text-xs">
                  {user?.email || "Chưa đăng nhập"}
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}

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
              className="w-full justify-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-2 px-4 py-3 min-h-[48px] gap-3 text-sm font-medium"
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

function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground px-4 py-3 min-h-[56px] gap-3"
        >
          <Link href="/" className="flex items-center gap-3">
            <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
              <Image
                src="https://res.cloudinary.com/haricorp/image/upload/v1754348466/Gemini_Generated_Image_1owgb01owgb01owg_knc0fr.png"
                alt="Logo"
                className="rounded"
                width={32}
                height={32}
              />
            </div>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-medium text-sm">Hari Social</span>
              <span className="truncate text-xs">MXH - Thông tin thu nhỏ</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function SidebarWithContext({
  user,
  handleLogout,
  profileLoading,
  collapsible,
}: {
  user: any;
  handleLogout: () => void;
  profileLoading: boolean;
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { setOpen } = useSidebar();
  const isTablet = useIsTablet();
  const isMobileHook = useIsMobile();
  const pathname = usePathname();

  React.useEffect(() => {
    if (isTablet && !isMobileHook) {
      setOpen(false);
    } else if (!isTablet && !isMobileHook) {
      setOpen(true);
    }
  }, [isTablet, isMobileHook, setOpen]);

  const [openConfirmLogout, setOpenConfirmLogout] = React.useState(false);
  const [openPostFeed, setOpenPostFeed] = React.useState(false);

  const navData = getNavData(!!user);

  function NavMain({ items }: { items: typeof navData.navMain }) {
    const iconSize = 48;
    const isSelectedClass = (url: string) =>
      pathname === url ? "font-bold" : "font-light";
    const strokeWidth = (url: string) => (pathname === url ? 3 : 2.25);
    const getIcon = (icon: LucideIcon, url: string) => {
      if (icon === Home)
        return <House size={iconSize} strokeWidth={strokeWidth(url)} />;
      if (icon === Newspaper)
        return <Newspaper size={iconSize} strokeWidth={strokeWidth(url)} />;
      if (icon === TrendingUp)
        return <TrendingUp size={iconSize} strokeWidth={strokeWidth(url)} />;
      if (icon === SquarePlus)
        return <SquarePlus size={iconSize} strokeWidth={strokeWidth(url)} />;
      return;
    };

    return (
      <SidebarGroup className="py-4">
        <SidebarMenu className="">
          {items.map((item) =>
            item.hasDropdown && item.items ? (
              <SidebarMenuItem key={item.title}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      className={`cursor-pointer px-4 py-3 text-base font-light min-h-[48px] gap-3 ${
                        pathname.startsWith(item.url)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }`}
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side="bottom"
                    align="start"
                  >
                    {item.items.map((subItem) => (
                      <DropdownMenuItem
                        key={subItem.title}
                        className="py-3 px-4"
                        onClick={() => {
                          if (subItem.action === "openPostFeed") {
                            setOpenPostFeed(true);
                          }
                        }}
                        asChild={subItem.url ? true : false}
                      >
                        {subItem.url ? (
                          <Link
                            href={subItem.url}
                            className="flex items-center gap-3"
                          >
                            {subItem.icon && (
                              <subItem.icon className="h-4 w-4" />
                            )}
                            <span>{subItem.title}</span>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 cursor-pointer">
                            {subItem.icon && (
                              <subItem.icon className="h-4 w-4" />
                            )}
                            <span>{subItem.title}</span>
                          </div>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ) : item.items ? (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`px-4 py-3 text-base font-medium min-h-[48px] gap-3 ${
                        pathname.startsWith(item.url)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }`}
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-4 mt-2">
                      {item.items.map((subItem) =>
                        subItem.action === "openPostFeed" ? (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className="py-1"
                          >
                            <SidebarMenuSubButton asChild>
                              <button
                                type="button"
                                onClick={() => setOpenPostFeed(true)}
                                className="w-full text-left py-2 px-3 text-sm"
                              >
                                <span>{subItem.title}</span>
                              </button>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ) : (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className="py-1"
                          >
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={subItem.url || "#"}
                                className="py-2 px-3 text-sm"
                              >
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
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`px-4 py-3 text-base font-medium min-h-[48px] gap-3 ${
                    pathname === item.url
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }`}
                >
                  <Link href={item.url || "#"}>
                    {item.icon && getIcon(item.icon, item.url)}
                    <span className={isSelectedClass(item.url)}>
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <Sidebar collapsible={collapsible}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {profileLoading ? (
          <Skeleton className="h-10 w-full rounded-md" />
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

function BottomNavBar({
  isAuthenticated,
  user,
  profileLoading,
  setOpenPostFeed,
}: {
  isAuthenticated: boolean;
  user?: any;
  profileLoading: boolean;
  setOpenPostFeed: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 bg-sidebar text-sidebar-foreground border-t border-border md:hidden items-center justify-around px-2">
      <Link
        href="/"
        className={`flex-1 flex flex-col items-center justify-center py-1 ${
          pathname === "/" ? "text-sidebar-accent-foreground" : ""
        }`}
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Trang chủ</span>
      </Link>
      <Link
        href="/news"
        className={`flex-1 flex flex-col items-center justify-center py-1 ${
          pathname.startsWith("/news") ? "text-sidebar-accent-foreground" : ""
        }`}
      >
        <Newspaper className="h-5 w-5" />
        <span className="text-xs mt-1">Tin tức</span>
      </Link>

      {/* Nút Tạo nổi bật ở giữa */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Create new content"
            className="flex-shrink-0 mx-4 cursor-pointer focus:outline-none"
          >
            <div className="bg-primary text-primary-foreground h-14 w-14 rounded-full flex items-center justify-center border-4 border-sidebar shadow-lg">
              <SquarePlus className="h-7 w-7" />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg mb-8"
          side="top"
          align="center"
          sideOffset={10}
        >
          {/* Item 1: Bài viết (Feed) */}
          <DropdownMenuItem
            className="py-3 px-4 flex items-center gap-3 cursor-pointer"
            onClick={() => setOpenPostFeed(true)}
          >
            <PenTool className="h-4 w-4" />
            <span>Bài viết (Feed)</span>
          </DropdownMenuItem>
          {/* Item 2: Bài báo (News) */}
          <Link href="/news/create" passHref>
            <DropdownMenuItem
              asChild
              className="py-3 px-4 flex items-center gap-3"
            >
              <div>
                <FileText className="h-4 w-4" />
                <span>Bài báo (News)</span>
              </div>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        href="/explore"
        className={`flex-1 flex flex-col items-center justify-center py-1 ${
          pathname === "/explore" ? "text-sidebar-accent-foreground" : ""
        }`}
      >
        <TrendingUp className="h-5 w-5" />
        <span className="text-xs mt-1">Khám phá</span>
      </Link>
      <Link
        href={isAuthenticated && user ? `/profile/${user.id}` : "#"}
        onClick={(e) => {
          if (!isAuthenticated) {
            e.preventDefault();
            useAuthStore.setState({ showLoginDialog: true });
          }
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1 ${
          pathname.startsWith(`/profile/${user?.id}`)
            ? "text-sidebar-accent-foreground"
            : ""
        }`}
      >
        {profileLoading ? (
          <div className="flex flex-col items-center">
            <Skeleton className="h-5 w-5 rounded-full" />
            <span className="text-xs mt-1">Tải...</span>
          </div>
        ) : isAuthenticated && user ? (
          <>
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={user?.avatar || "https://picsum.photos/32"}
                alt={user?.name || "User"}
              />
              <AvatarFallback className="text-xs">
                {user?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs mt-1 truncate max-w-12">
              {user?.name || "Tài khoản"}
            </span>
          </>
        ) : (
          <>
            <UserIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Đăng nhập</span>
          </>
        )}
      </Link>
    </nav>
  );
}

export function AppSidebar({ children }: { children?: React.ReactNode }) {
  const { profile, logout, profileLoading } = useAuth();
  const { showLoginDialog } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  const isTablet = useIsTablet();
  const isMobile = useIsMobile();
  const collapsible = isMobile ? "offcanvas" : isTablet ? "icon" : "offcanvas";
  const [openPostFeed, setOpenPostFeed] = React.useState(false);

  const handleAuthDialogClose = (open: boolean) => {
    if (!open) {
      useAuthStore.setState({ showLoginDialog: false });
    }
  };

  if (profileLoading && !profile) {
    return (
      <SidebarProvider>
        <Sidebar variant="inset" collapsible={collapsible}>
          <SidebarHeader />
          <SidebarContent />
          <SidebarFooter className="p-4">
            <Skeleton className="h-10 w-full rounded-md" />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="pb-14 md:pb-0">{children}</main>
        </SidebarInset>
        <BottomNavBar
          isAuthenticated={false}
          user={null}
          profileLoading={profileLoading}
          setOpenPostFeed={setOpenPostFeed}
        />
        {showLoginDialog && (
          <AuthDialog
            open={showLoginDialog}
            onOpenChange={handleAuthDialogClose}
          />
        )}
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
        <main className="pb-14 md:pb-0">{children}</main>
      </SidebarInset>
      <BottomNavBar
        isAuthenticated={!!profile}
        user={profile}
        profileLoading={profileLoading}
        setOpenPostFeed={setOpenPostFeed}
      />
      {showLoginDialog && (
        <AuthDialog
          open={showLoginDialog}
          onOpenChange={handleAuthDialogClose}
        />
      )}
      <PostCreateDialog open={openPostFeed} setOpen={setOpenPostFeed} />
    </SidebarProvider>
  );
}
