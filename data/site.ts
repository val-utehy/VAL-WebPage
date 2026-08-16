import type { Locale } from "@/lib/i18n";

export type ResearchArea = { title: string; eyebrow: string; description: string; topics: string[] };
export type Project = { title: string; category: string; description: string; tags: string[]; metric: string; status: string };
const common = {
  partners: ["University", "AI Institute", "GeoLab", "Vision Systems", "Open Research"],
};

const en = {
  stats: [
    { value: "60+", label: "Peer-reviewed publications" },
    { value: "12", label: "Active research projects" },
    { value: "25+", label: "Researchers and students" },
    { value: "8", label: "Research directions" },
  ],
  researchAreas: [
    { title: "Visual Intelligence", eyebrow: "01 / Perception", description: "Robust visual representations for detection, recognition, tracking and scene understanding in complex environments.", topics: ["Object detection", "Tracking", "Segmentation"] },
    { title: "Multimodal Learning", eyebrow: "02 / Reasoning", description: "Models that connect images, language, spatial context and structured knowledge for grounded machine reasoning.", topics: ["Vision-language", "Foundation models", "Retrieval"] },
    { title: "3D Vision", eyebrow: "03 / Geometry", description: "Reconstruction, neural rendering and spatial AI for understanding real environments beyond a flat image plane.", topics: ["Neural rendering", "Depth", "Reconstruction"] },
    { title: "Generative AI", eyebrow: "04 / Generation", description: "Generative models that create, edit and transform visual content with controllable, high-fidelity outputs.", topics: ["Diffusion models", "Image generation", "Multimodal generation"] },
  ] satisfies ResearchArea[],
  projects: [
    { title: "GeoVision Foundation Model", category: "Earth observation", description: "A unified representation model for multi-sensor satellite imagery and downstream geospatial tasks.", tags: ["Multispectral", "Self-supervised", "GeoAI"], metric: "+18.4% transfer accuracy", status: "Active" },
    { title: "OpenWorld Track", category: "Video understanding", description: "Long-horizon object tracking that remains stable under occlusion, domain shifts and unseen categories.", tags: ["Tracking", "Open-world", "Video"], metric: "42 benchmark sequences", status: "Active" },
    { title: "Neural Scene Studio", category: "3D vision", description: "A lightweight pipeline for turning sparse imagery into interactive scene representations for the web.", tags: ["3DGS", "NeRF", "WebGL"], metric: "Real-time browser demo", status: "Prototype" },
  ] satisfies Project[],
};

const vi = {
  stats: [
    { value: "60+", label: "Công bố phản biện khoa học" },
    { value: "12", label: "Dự án nghiên cứu đang hoạt động" },
    { value: "25+", label: "Nhà nghiên cứu và sinh viên" },
    { value: "8", label: "Hướng nghiên cứu" },
  ],
  researchAreas: [
    { title: "Trí tuệ thị giác", eyebrow: "01 / Nhận biết", description: "Biểu diễn thị giác bền vững cho phát hiện, nhận dạng, theo dõi và hiểu cảnh trong các môi trường phức tạp.", topics: ["Phát hiện đối tượng", "Theo dõi", "Phân đoạn"] },
    { title: "Học đa phương thức", eyebrow: "02 / Suy luận", description: "Các mô hình kết nối hình ảnh, ngôn ngữ, bối cảnh không gian và tri thức có cấu trúc để suy luận có căn cứ.", topics: ["Thị giác-ngôn ngữ", "Mô hình nền tảng", "Truy hồi"] },
    { title: "Thị giác 3D", eyebrow: "03 / Hình học", description: "Tái tạo, kết xuất neural và AI không gian để hiểu môi trường thực vượt ra ngoài mặt phẳng ảnh.", topics: ["Kết xuất neural", "Độ sâu", "Tái tạo"] },
    { title: "AI tạo sinh", eyebrow: "04 / Tạo sinh", description: "Các mô hình tạo sinh giúp tạo mới, chỉnh sửa và biến đổi nội dung thị giác với đầu ra có thể kiểm soát và giàu chi tiết.", topics: ["Mô hình diffusion", "Sinh ảnh", "Tạo sinh đa phương thức"] },
  ] satisfies ResearchArea[],
  projects: [
    { title: "GeoVision Foundation Model", category: "Quan sát Trái Đất", description: "Mô hình biểu diễn thống nhất cho ảnh vệ tinh đa cảm biến và các tác vụ địa không gian phía sau.", tags: ["Đa phổ", "Tự giám sát", "GeoAI"], metric: "+18,4% độ chính xác chuyển giao", status: "Đang thực hiện" },
    { title: "OpenWorld Track", category: "Hiểu video", description: "Theo dõi đối tượng dài hạn, ổn định khi che khuất, chuyển miền và xuất hiện lớp chưa từng thấy.", tags: ["Theo dõi", "Thế giới mở", "Video"], metric: "42 chuỗi benchmark", status: "Đang thực hiện" },
    { title: "Neural Scene Studio", category: "Thị giác 3D", description: "Pipeline nhẹ chuyển tập ảnh thưa thành biểu diễn cảnh tương tác chạy trực tiếp trên web.", tags: ["3DGS", "NeRF", "WebGL"], metric: "Demo thời gian thực", status: "Nguyên mẫu" },
  ] satisfies Project[],
};

export function getSiteData(locale: Locale) {
  const localized = locale === "vi" ? vi : en;
  return { ...common, ...localized };
}
