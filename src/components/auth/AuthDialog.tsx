"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/lib/modules/auth/hooks/useLoginMutation";
import { useRegisterMutation } from "@/lib/modules/auth/hooks/useRegisterMutation";
import { useSendEmailVerificationMutation } from "@/lib/modules/auth/hooks/useSendEmailVerificationMutation";
import Image from "next/image";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export function AuthDialog({
  trigger,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [tab, setTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const sendEmailVerificationMutation = useSendEmailVerificationMutation();

  // Handle login success - reload page
  useEffect(() => {
    if (loginMutation.isSuccess) {
      // Close dialog first
      onOpenChange?.(false);
      // Reload page to update auth state
      window.location.reload();
    }
  }, [loginMutation.isSuccess, onOpenChange]);

  // Handle register success - switch to login tab
  useEffect(() => {
    if (registerMutation.isSuccess) {
      // Reset register form
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterName("");
      setRegisterConfirmPassword("");
      setToken("");
      setRegisterError(null);

      // Switch to login tab
      setTab("login");

      // Optional: Pre-fill login email with registered email
      setLoginEmail(registerEmail);
    }
  }, [registerMutation.isSuccess, registerEmail]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email: loginEmail, password: loginPassword });
  };

  const handleSendOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!registerEmail) return;
    sendEmailVerificationMutation.mutate({ email: registerEmail });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Mật khẩu xác nhận không khớp");
      return;
    }
    registerMutation.mutate({
      email: registerEmail,
      password: registerPassword,
      name: registerName,
      token,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="w-[80vw] !max-w-none p-0 bg-background border-none overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row w-full min-h-[600px] max-h-[80vh] overflow-hidden">
          {/* Left Side - Image with Overlay Text */}
          <div className="hidden lg:flex flex-col justify-center items-center w-1/2 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="https://res.cloudinary.com/haricorp/image/upload/v1754348466/Gemini_Generated_Image_1owgb01owgb01owg_knc0fr.png"
                alt="Hình nền xác thực"
                fill
                className="object-cover rounded"
                priority
              />
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="flex-1 flex flex-col justify-start p-6 sm:p-8 lg:p-12 bg-background overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="text-center lg:text-left mb-2">
              <DialogTitle className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {tab === "register" ? "Đăng ký" : "Đăng nhập"}
              </DialogTitle>
              <p className="text-muted-foreground text-lg">
                {tab === "register"
                  ? "Tham gia cùng chúng tôi hôm nay và bắt đầu hành trình của bạn"
                  : "Đăng nhập để tiếp tục vào tài khoản của bạn"}
              </p>
            </div>

            {/* Success Messages */}
            {registerMutation.isSuccess && tab === "login" && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✅ Đăng ký thành công! Vui lòng đăng nhập với tài khoản mới.
                </p>
              </div>
            )}

            {/* Tabs */}
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Địa chỉ Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-11 h-12"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu của bạn"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-11 pr-11 h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 font-semibold"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang đăng nhập...</span>
                      </div>
                    ) : (
                      "Đăng nhập"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-6">
                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="text"
                        placeholder="Nhập họ và tên của bạn"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="pl-11 h-12"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Địa chỉ Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-11 h-12"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Tạo mật khẩu"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-11 pr-11 h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Xác nhận Mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu của bạn"
                        value={registerConfirmPassword}
                        onChange={(e) =>
                          setRegisterConfirmPassword(e.target.value)
                        }
                        className="pl-11 pr-11 h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Verification Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Mã xác nhận
                    </label>
                    <div className="flex gap-3">
                      <Input
                        type="text"
                        placeholder="Nhập mã xác nhận"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="flex-1 h-12"
                      />
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={
                          sendEmailVerificationMutation.isPending ||
                          !registerEmail
                        }
                        variant="secondary"
                        className="px-6 h-12 font-medium whitespace-nowrap"
                      >
                        {sendEmailVerificationMutation.isPending ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>Đang gửi...</span>
                          </div>
                        ) : (
                          "Gửi mã"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {registerError && (
                    <div className="p-3 bg-destructive/15 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive">
                        {registerError}
                      </p>
                    </div>
                  )}

                  {/* Register Error from API */}
                  {registerMutation.isError && (
                    <div className="p-3 bg-destructive/15 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive">
                        Đăng ký thất bại. Vui lòng thử lại.
                      </p>
                    </div>
                  )}

                  {/* Register Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 font-semibold"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tạo tài khoản...</span>
                      </div>
                    ) : (
                      "Tạo tài khoản"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
