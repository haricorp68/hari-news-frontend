"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
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
function SidebarWithContext({
  user,
  handleLogout,
  profileLoading,
}: {
  user: any;
  handleLogout: () => void;
  profileLoading: boolean;
}) {
  const { state } = useSidebar();
  const [openConfirmLogout, setOpenConfirmLogout] = React.useState(false);
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
          <div className="flex items-center gap-2 px-4 py-2">
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
                    {state === "expanded" && <span>Home</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/news">
                    <Newspaper className="h-4 w-4" />
                    {state === "expanded" && <span>News</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/trending">
                    <TrendingUp className="h-4 w-4" />
                    {state === "expanded" && <span>Trending</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/categories">
                    <FileText className="h-4 w-4" />
                    {state === "expanded" && <span>Categories</span>}
                  </Link>
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
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            {profileLoading ? (
              <Skeleton className="h-8 w-full rounded-md" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="w-full h-14">
                    <Avatar className="mr-2 rounded-lg">
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
                    variant="destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthDialog
                trigger={
                  <Button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>Login</span>
                  </Button>
                }
              />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
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
    </Sidebar>
  );
}

export function AppSidebar() {
  const { user, logout, profileLoading } = useAuth();
  const handleLogout = () => {
    logout();
  };

  // Nếu đang loading profile lần đầu, chỉ render skeleton hoặc null để tránh render SidebarWithContext sớm
  if (profileLoading && !user) {
    return (
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader />
          <SidebarContent />
          <SidebarFooter className="p-4">
            <Skeleton className="h-8 w-full rounded-md" />
          </SidebarFooter>
        </Sidebar>
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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 px-4">
            <span className="text-lg font-semibold">Dashboard</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Main content goes here */}
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Welcome to Hari News</h1>
              <p className="text-muted-foreground">
                Select a menu item to get started
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
