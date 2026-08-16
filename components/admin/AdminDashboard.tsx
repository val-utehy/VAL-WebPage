import Link from "next/link";
import { getGalleryItems } from "@/lib/gallery";
import { getAllMembers } from "@/lib/members";
import { getAllPosts } from "@/lib/posts";
import { getPublications } from "@/lib/publications";

export function AdminDashboard() {
  const modules = [
    { number: "01", name: "Tin tức", description: "Soạn, lưu nháp và xuất bản bài viết của lab.", count: getAllPosts("vi").length, unit: "bài viết" },
    { number: "02", name: "Thành viên", description: "Quản lý hồ sơ, ảnh chân dung và thông tin nghiên cứu.", count: getAllMembers("vi").length, unit: "hồ sơ" },
    { number: "03", name: "Thư viện ảnh", description: "Tạo album và sắp xếp ảnh hoạt động của lab.", count: getGalleryItems("vi").length, unit: "album" },
    { number: "04", name: "Công bố", description: "Cập nhật bài báo, DOI, tác giả và liên kết tài liệu.", count: getPublications().length, unit: "công bố" },
  ];

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/en" className="admin-brand"><span>VL</span><strong>Vision &amp; Learning<br />Research Lab</strong></Link>
        <nav aria-label="Admin navigation"><a className="is-active" href="#overview">Tổng quan</a>{modules.map((module) => <a href={`#${module.number}`} key={module.number}>{module.name}</a>)}<a href="#settings">Cài đặt</a></nav>
        <p>Admin workspace<br />v0.1 · Nội bộ</p>
      </aside>
      <section className="admin-content" id="overview">
        <header className="admin-topbar"><div><p>Không gian quản trị</p><h1>Chào mừng trở lại.</h1></div><div className="admin-user"><span>VL</span><div><strong>Lab editor</strong><small>Quyền quản trị sẽ thêm sau</small></div></div></header>
        <section className="admin-intro"><p>TRẠNG THÁI HỆ THỐNG</p><h2>Giao diện quản trị đã sẵn sàng.<br />CMS sẽ được kết nối theo từng module.</h2><span>Hiện trang này chỉ hiển thị dữ liệu có sẵn, không ghi thay đổi vào website.</span></section>
        <section className="admin-module-grid" aria-label="Content modules">{modules.map((module) => <article className="admin-module-card" id={module.number} key={module.number}><div><span>{module.number}</span><em>Đang chuẩn bị</em></div><h2>{module.name}</h2><p>{module.description}</p><footer><strong>{module.count}</strong> {module.unit}<button type="button" disabled>Thiết lập CMS →</button></footer></article>)}</section>
        <section className="admin-settings" id="settings"><div><p>TIẾP THEO</p><h2>Kết nối từng khu vực theo đúng quy trình của lab.</h2></div><ol><li>Phân quyền và đăng nhập</li><li>Trình soạn thảo cho Tin tức</li><li>Upload ảnh và quản lý thành viên</li></ol></section>
      </section>
    </main>
  );
}
