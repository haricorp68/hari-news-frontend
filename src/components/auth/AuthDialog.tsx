"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/modules/auth/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { LucideApple, LucideCircleUser } from "lucide-react";

export function AuthDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [tab, setTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [token, setToken] = useState("");

  const {
    login,
    loginLoading,
    register,
    registerLoading,
    checkExist,
    existError,
  } = useAuth();

  const { sendEmailVerification, sendEmailVerificationLoading } = useAuth();

  const queryClient = useQueryClient();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email: loginEmail, password: loginPassword }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      },
    });
  };

  const handleSendOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!registerEmail) return;
    sendEmailVerification({ email: registerEmail });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Mật khẩu xác nhận không khớp");
      return;
    }
    register({
      email: registerEmail,
      password: registerPassword,
      name: registerName,
      token,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[60vw] !max-w-none p-0 bg-background border-none rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row w-full h-full">
          {/* Left: Image only */}
          <div className="hidden md:flex flex-col justify-center items-center bg-muted p-0 w-1/2 min-h-[600px]">
            <Image
              src="https://picsum.photos/seed/amu/600/800"
              alt="Auth visual"
              width={600}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Right: Form */}
          <div className="flex-1 flex flex-col min-h-[700px] justify-start px-6 py-8 md:p-12 bg-background">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold">
                {tab === "register"
                  ? "Create an account"
                  : "Sign in to your account"}
              </DialogTitle>
              {/* Đã có Tabs, không cần dòng chuyển tab bằng text nữa */}
            </DialogHeader>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="mx-2 text-xs text-muted-foreground">
                    or continue with
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <LucideCircleUser className="h-5 w-5 mr-2" /> Google
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <LucideApple className="h-5 w-5 mr-2" /> Apple
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="flex gap-2">
                    <div className="w-full">
                      <Input
                        type="text"
                        placeholder="Name"
                        value={registerName}
                        onChange={(e) => {
                          setRegisterName(e.target.value);
                          checkExist({ name: e.target.value });
                        }}
                        required
                        className={
                          existError.name
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                      />
                      {existError.name && (
                        <div className="text-xs text-destructive mt-1">
                          {existError.name}
                        </div>
                      )}
                    </div>
                    {/* Có thể thêm trường last name nếu muốn */}
                  </div>
                  <div className="w-full">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={registerEmail}
                      onChange={(e) => {
                        setRegisterEmail(e.target.value);
                        checkExist({ email: e.target.value });
                      }}
                      required
                      className={
                        existError.email
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    />
                    {existError.email && (
                      <div className="text-xs text-destructive mt-1">
                        {existError.email}
                      </div>
                    )}
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    required
                  />
                  {registerError && (
                    <div className="text-xs text-destructive">
                      {registerError}
                    </div>
                  )}
                  <div className="flex items-center ">
                    <input
                      type="checkbox"
                      required
                      className="accent-primary"
                      id="terms"
                    />
                    <label
                      htmlFor="terms"
                      className="text-xs text-muted-foreground select-none"
                    >
                      I agree to the Terms & Conditions
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="text"
                      placeholder="Mã xác thực"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendEmailVerificationLoading || !registerEmail}
                    >
                      {sendEmailVerificationLoading ? "Đang gửi mã" : "Gửi mã"}
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      registerLoading || !!existError.email || !!existError.name
                    }
                  >
                    {registerLoading
                      ? "Đang tạo tài khoản..."
                      : "Tạo tài khoản"}
                  </Button>
                </form>
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="mx-2 text-xs text-muted-foreground">
                    or continue with
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <LucideCircleUser className="h-5 w-5 mr-2" /> Google
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <LucideApple className="h-5 w-5 mr-2" /> Apple
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
