"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { assetPath } from "@/lib/assets";

export default function LocaleGateway() {
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("vllab-locale");
    const browserLanguage = navigator.languages?.[0] || navigator.language || "en";
    const locale = saved === "vi" || saved === "en"
      ? saved
      : browserLanguage.toLowerCase().startsWith("vi")
        ? "vi"
        : "en";
    router.replace(`/${locale}`);
  }, [router]);

  return (
    <main className="locale-gateway">
      <Image src={assetPath("/vl-lab-mark.png")} alt="Vision and Learning Lab" width={112} height={102} priority style={{ width: 112, height: "auto" }} />
      <p>Detecting language · Đang nhận diện ngôn ngữ</p>
      <div>
        <a href="./en/">English</a>
        <a href="./vi/">Tiếng Việt</a>
      </div>
    </main>
  );
}
