"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Home,
  Newspaper,
  Settings,
  LogOut,
  Search,
  Bell,
  Bookmark,
  TrendingUp,
  FileText,
  ChevronUp,
  User as UserIcon,
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
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function SidebarWithContext({
  user,
  handleLogout,
  profileLoading,
}: {
  user: any;
  handleLogout: () => void;
  profileLoading: boolean;
}) {
  const { state, setOpen } = useSidebar();
  const [prevSidebarState, setPrevSidebarState] = React.useState<'expanded' | 'collapsed'>('expanded');
  const [openConfirmLogout, setOpenConfirmLogout] = React.useState(false);
  const [openSearch, setOpenSearch] = React.useState(false);
  const [openNotification, setOpenNotification] = React.useState(false);

  // Khi mở search/notification, collapse sidebar
  const handleOpenSearch = () => {
    setPrevSidebarState(state);
    setOpen(false);
    setOpenSearch(true);
  };
  const handleOpenNotification = () => {
    setPrevSidebarState(state);
    setOpen(false);
    setOpenNotification(true);
  };
  // Khi đóng sheet, trả lại trạng thái sidebar trước đó
  const handleCloseSheet = (setOpenSheet: (v: boolean) => void) => (open: boolean) => {
    setOpenSheet(open);
    if (!open && prevSidebarState === 'expanded') {
      setOpen(true);
    }
  };

  // Loại bỏ useEffect set CSS custom - không cần thiết
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {state === "collapsed" ? (
          <div className="flex items-center justify-center py-2">
            <Image
              src="https://picsum.photos/40"
              alt="Logo"
              className="h-8 w-8 rounded-lg object-cover"
              width={32}
              height={32}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="https://picsum.photos/40"
                alt="Logo"
                className="h-8 w-8 rounded-lg object-cover"
                width={32}
                height={32}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Hari News</span>
                <span className="text-xs text-muted-foreground">
                  Latest Updates
                </span>
              </div>
            </div>
            <SidebarTrigger className="ml-auto" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    {state === "expanded" && <span>Trang chủ</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleOpenSearch}>
                  <Search className="h-4 w-4" />
                  {state === "expanded" && <span>Tìm kiếm</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/explore">
                    <TrendingUp className="h-4 w-4" />
                    {state === "expanded" && <span>Khám phá</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/news">
                    <Newspaper className="h-4 w-4" />
                    {state === "expanded" && <span>Tin tức</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/messages">
                    <FileText className="h-4 w-4" />
                    {state === "expanded" && <span>Tin nhắn</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleOpenNotification}>
                  <Bell className="h-4 w-4" />
                  {state === "expanded" && <span>Thông báo</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Personal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/bookmarks">
                    <Bookmark className="h-4 w-4" />
                    {state === "expanded" && <span>Bookmarks</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/notifications">
                    <Bell className="h-4 w-4" />
                    {state === "expanded" && <span>Notifications</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/search">
                    <Search className="h-4 w-4" />
                    {state === "expanded" && <span>Search</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {state === "collapsed" ? (
          <div className="flex items-center justify-center py-2 w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-0 w-8 h-8 flex justify-center items-center bg-transparent shadow-none hover:bg-muted rounded-lg">
                  <Image
                    src={user?.avatar || "https://picsum.photos/32"}
                    alt={user?.name || "User"}
                    className="h-8 w-8 rounded-lg object-cover"
                    width={32}
                    height={32}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="min-w-[180px]">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setOpenConfirmLogout(true)}
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              {profileLoading ? (
                <Skeleton className="h-8 w-full rounded-md" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full h-14">
                      <Avatar className="rounded-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="truncate flex-1">{user.name}</span>
                      <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-full min-w-0"
                    style={{ width: "var(--radix-popper-anchor-width)" }}
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setOpenConfirmLogout(true)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <AuthDialog
                  trigger={
                    <Button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium">
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span>Login</span>
                    </Button>
                  }
                />
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
      {/* Sheet cho Search */}
      <Sheet open={openSearch} onOpenChange={handleCloseSheet(setOpenSearch)}>
        <SheetContent
          side="left"
          hideOverlay={true}
          className="max-w-lg w-full p-0 rounded-2xl overflow-hidden fixed top-0 left-0 h-full"
          zIndex={20}
          style={{
            transform: openSearch
              ? `translateX(${state === 'expanded' ? 'var(--sidebar-width)' : 'var(--sidebar-width-icon)'})`
              : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <SheetHeader>
            <SheetTitle>Tìm kiếm</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <input
              className="w-full p-2 rounded bg-muted"
              placeholder="Tìm kiếm"
              autoFocus
            />
            <div className="mt-4 text-muted-foreground text-sm">Mới đây</div>
            {/* ... có thể render danh sách lịch sử tìm kiếm ở đây ... */}
          </div>
        </SheetContent>
      </Sheet>
      {/* Sheet cho Notification */}
      <Sheet open={openNotification} onOpenChange={handleCloseSheet(setOpenNotification)}>
        <SheetContent
          side="left"
          hideOverlay={true}
          className="max-w-lg w-full p-0 rounded-2xl overflow-hidden fixed top-0 left-0 h-full"
          zIndex={20}
          style={{
            transform: openNotification
              ? `translateX(${state === 'expanded' ? 'var(--sidebar-width)' : 'var(--sidebar-width-icon)'})`
              : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <SheetHeader>
            <SheetTitle>Thông báo</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {/* ... render danh sách thông báo ở đây ... */}
            <div className="text-muted-foreground text-sm">
              Chưa có thông báo mới.
            </div>
          </div>
        </SheetContent>
      </Sheet>
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
    </Sidebar>
  );
}

export function AppSidebar({ children }: { children?: React.ReactNode }) {
  const { user, logout, profileLoading } = useAuth();
  const handleLogout = () => {
    logout();
  };

  // Nếu đang loading profile lần đầu, chỉ render skeleton hoặc null để tránh render SidebarWithContext sớm
  if (profileLoading && !user) {
    return (
      <SidebarProvider>
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader />
          <SidebarContent />
          <SidebarFooter className="p-4">
            <Skeleton className="h-8 w-full rounded-md" />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <SidebarWithContext
        user={user}
        handleLogout={handleLogout}
        profileLoading={profileLoading}
      />
      <SidebarInset>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
