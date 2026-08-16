"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/admin/dashboard");
  }

  return (
    <main className="admin-login">
      <section className="admin-login__brand">
        <Link href="/en" className="admin-brand"><span>VL</span><strong>Vision &amp; Learning<br />Research Lab</strong></Link>
        <div><p>ADMIN WORKSPACE</p><h1>Nơi nội dung của lab được chăm chút.</h1><span>Quản lý tin tức, thành viên, ảnh và công bố trong một không gian làm việc thống nhất.</span></div>
        <small>Vision and Learning Lab · Nội bộ</small>
      </section>
      <section className="admin-login__panel">
        <form onSubmit={submit}>
          <p>ĐĂNG NHẬP</p>
          <h2>Chào mừng trở lại.</h2>
          <span className="admin-login__intro">Dùng tài khoản quản trị của Vision and Learning Lab để tiếp tục.</span>
          <label>Email công việc<input name="email" type="email" autoComplete="email" placeholder="name@utehy.edu.vn" required /></label>
          <label>Mật khẩu<div className="admin-password"><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="••••••••" required /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Ẩn" : "Hiện"}</button></div></label>
          <div className="admin-login__options"><label><input type="checkbox" /> Ghi nhớ trên thiết bị này</label><button type="button" className="admin-text-button">Quên mật khẩu?</button></div>
          <button className="admin-login__submit" type="submit">Đăng nhập <span>→</span></button>
          <p className="admin-login__notice">Bản UI đang ở chế độ preview. Xác thực, phân quyền và khôi phục mật khẩu sẽ được kết nối trước khi admin được mở cho người dùng.</p>
        </form>
      </section>
    </main>
  );
}
