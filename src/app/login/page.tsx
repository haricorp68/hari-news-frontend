"use client";
import { useAuth } from "@/lib/modules/auth/useAuth";
import Image from "next/image";
import React, { useState } from "react";

const LoginPage = () => {
  const { login, loginLoading, user, profileLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <button type="submit" disabled={loginLoading} style={{ width: "100%" }}>
          {loginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <hr />

      <h3>Thông tin người dùng</h3>
      {profileLoading ? (
        <p>Đang tải thông tin...</p>
      ) : user ? (
        <div>
          <p>
            <b>ID:</b> {user.id}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Tên:</b> {user.name}
          </p>
          <Image src={user.avatar} alt="avatar" width={80} height={80} />
        </div>
      ) : (
        <p>Chưa đăng nhập</p>
      )}
    </div>
  );
};

export default LoginPage;
