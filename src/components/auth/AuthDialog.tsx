// components/auth/AuthDialog.tsx
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
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Sparkles,
} from "lucide-react";

// Google Brand Colors
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Facebook Brand Colors
const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

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
                src="https://picsum.photos/200/300" // Thay đổi đường dẫn ảnh tại đây
                alt="Authentication background"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Text Content overlaid on image */}
            <div className="relative z-10 text-center text-white px-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4 leading-tight drop-shadow-lg">
                Welcome to Our
                <br />
                <span className="text-yellow-300">Amazing Platform</span>
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed drop-shadow-md">
                Join thousands of users who trust us with their digital
                experience. Secure, fast, and reliable.
              </p>
              <div className="flex items-center justify-center space-x-8 text-white/90">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 drop-shadow-sm" />
                  <span className="text-sm font-medium drop-shadow-sm">
                    Secure
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 drop-shadow-sm" />
                  <span className="text-sm font-medium drop-shadow-sm">
                    Trusted
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 drop-shadow-sm" />
                  <span className="text-sm font-medium drop-shadow-sm">
                    Fast
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="flex-1 flex flex-col justify-start p-6 sm:p-8 lg:p-12 bg-background overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="text-center lg:text-left mb-2">
              <DialogTitle className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {tab === "register" ? "Create Account" : "Welcome Back"}
              </DialogTitle>
              <p className="text-muted-foreground text-lg">
                {tab === "register"
                  ? "Join us today and start your journey"
                  : "Sign in to continue to your account"}
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
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
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
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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
                      Forgot password?
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
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="mx-4 text-sm text-muted-foreground font-medium">
                    or continue with
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 font-medium">
                    <GoogleIcon />
                    <span className="ml-2">Google</span>
                  </Button>
                  <Button variant="outline" className="h-12 font-medium">
                    <FacebookIcon />
                    <span className="ml-2">Facebook</span>
                  </Button>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-6">
                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
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
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
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
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
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
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
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
                      Verification Code
                    </label>
                    <div className="flex gap-3">
                      <Input
                        type="text"
                        placeholder="Enter verification code"
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
                            <span>Sending...</span>
                          </div>
                        ) : (
                          "Send Code"
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
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="mx-4 text-sm text-muted-foreground font-medium">
                    or sign up with
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Social Register */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 font-medium">
                    <GoogleIcon />
                    <span className="ml-2">Google</span>
                  </Button>
                  <Button variant="outline" className="h-12 font-medium">
                    <FacebookIcon />
                    <span className="ml-2">Facebook</span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
