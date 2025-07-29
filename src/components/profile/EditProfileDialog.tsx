"use client";

import * as React from "react";
import {
  User as UserIcon,
  Camera,
  Mail,
  FileText,
  Globe,
  Save,
  X,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Gender,
  UpdateProfileDto,
  User,
} from "@/lib/modules/user/user.interface";
import { useUpdateProfile } from "@/lib/modules/user/hooks/useUpdateProfile";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

const settingsNav = [
  { name: "Thông tin cơ bản", icon: UserIcon, key: "basic" },
  { name: "Ảnh đại diện & bìa", icon: Camera, key: "images" },
  { name: "Liên hệ", icon: Mail, key: "contact" },
  { name: "Mạng xã hội", icon: Globe, key: "social" },
  { name: "Thông tin cá nhân", icon: FileText, key: "personal" },
];

interface EditProfileDialogProps {
  user: User;
  trigger?: React.ReactNode;
}

export function EditProfileDialog({ user, trigger }: EditProfileDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("basic");
  const [formData, setFormData] = React.useState<UpdateProfileDto>({
    name: user.name,
    bio: user.bio || undefined,
    avatar: user.avatar || undefined,
    coverImage: user.coverImage || undefined,
    phone: user.phone || undefined,
    dateOfBirth: user.dateOfBirth || undefined,
    gender: user.gender as Gender | undefined,
    address: user.address || undefined,
    city: user.city || undefined,
    alias: user.alias || undefined,
  });

  const {
    updateProfile,
    updateProfileLoading,
    updateProfileError,
    updateProfileSuccess,
  } = useUpdateProfile();

  const handleInputChange = (field: keyof UpdateProfileDto, value: string) => {
    if (field === "bio") {
      const lines = value.split("\n");
      if (lines.length <= 3) {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = () => {
    updateProfile({ data: formData });
  };

  React.useEffect(() => {
    if (updateProfileSuccess) {
      setOpen(false);
      setFormData({
        name: user.name,
        bio: user.bio || undefined,
        avatar: user.avatar || undefined,
        coverImage: user.coverImage || undefined,
        phone: user.phone || undefined,
        dateOfBirth: user.dateOfBirth || undefined,
        gender: user.gender as Gender | undefined,
        address: user.address || undefined,
        city: user.city || undefined,
        alias: user.alias || undefined,
      });
    }
  }, [updateProfileSuccess, user]);

  React.useEffect(() => {
    if (updateProfileError) {
      console.error("Lỗi cập nhật profile:", updateProfileError);
    }
  }, [updateProfileError]);

  const renderContent = () => {
    switch (activeSection) {
      case "basic":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên hiển thị</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nhập tên của bạn"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Viết vài dòng về bản thân..."
                rows={3}
                className="resize-none max-w-[90vh]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alias">Biệt danh</Label>
              <Input
                id="alias"
                value={formData.alias || ""}
                onChange={(e) => handleInputChange("alias", e.target.value)}
                placeholder="Nhập alias của bạn"
              />
            </div>
          </div>
        );

      case "images":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatar">URL Ảnh đại diện</Label>
              <Input
                id="avatar"
                value={formData.avatar || ""}
                onChange={(e) => handleInputChange("avatar", e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImage">URL Ảnh bìa</Label>
              <Input
                id="coverImage"
                value={formData.coverImage || ""}
                onChange={(e) =>
                  handleInputChange("coverImage", e.target.value)
                }
                placeholder="https://example.com/cover.jpg"
              />
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+84 123 456 789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Nhập địa chỉ của bạn"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Thành phố</Label>
              <Input
                id="city"
                value={formData.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Nhập thành phố"
              />
            </div>
          </div>
        );

      case "personal":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select
                value={formData.gender || ""}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "social":
        return (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Tính năng liên kết mạng xã hội sẽ được cập nhật trong phiên bản
              tiếp theo.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Chỉnh sửa trang cá nhân
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[800px] lg:max-w-[900px]">
        <DialogTitle className="sr-only">
          Chỉnh sửa thông tin cá nhân
        </DialogTitle>
        <DialogDescription className="sr-only">
          Cập nhật thông tin cá nhân của bạn
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {settingsNav.map((item) => (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton
                          asChild
                          isActive={activeSection === item.key}
                          onClick={() => setActiveSection(item.key)}
                        >
                          <button type="button">
                            <item.icon />
                            <span>{item.name}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[580px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
              <div className="md:hidden">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="p-4">
                      <h4 className="mb-4 text-lg font-semibold">Cài đặt</h4>
                      {settingsNav.map((item) => (
                        <DrawerClose asChild key={item.key}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start mb-2"
                            onClick={() => setActiveSection(item.key)}
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </Button>
                        </DrawerClose>
                      ))}
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
              <Breadcrumb className="flex-1">
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Cài đặt</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {
                        settingsNav.find((item) => item.key === activeSection)
                          ?.name
                      }
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {updateProfileError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-md text-sm">
                  <strong>Lỗi:</strong>{" "}
                  {updateProfileError.message ||
                    "Có lỗi xảy ra khi cập nhật thông tin"}
                </div>
              )}

              {renderContent()}
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateProfileLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button onClick={handleSubmit} disabled={updateProfileLoading}>
                <Save className="w-4 h-4 mr-2" />
                {updateProfileLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
