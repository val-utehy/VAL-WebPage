"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { assetPath } from "@/lib/assets";

export default function LocaleGateway() {
  const router = useRouter();
  const [showChoices, setShowChoices] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vllab-locale");
    const browserLanguage = navigator.languages?.[0] || navigator.language || "en";
    const locale = saved === "vi" || saved === "en"
      ? saved
      : browserLanguage.toLowerCase().startsWith("vi")
        ? "vi"
        : "en";
    router.replace(`/${locale}`);

    /* Detection settles in a few frames, so on a first visit nobody sees the
       picker. It only surfaces if the redirect has not taken by now. */
    const reveal = setTimeout(() => setShowChoices(true), 1400);
    return () => clearTimeout(reveal);
  }, [router]);

  return (
    <main className="locale-gateway">
      <Image src={assetPath("/vl-lab-mark.png")} alt="Vision and Learning Lab" width={112} height={102} priority style={{ width: 112, height: "auto" }} />
      <p>Detecting language · Đang nhận diện ngôn ngữ</p>
      <div className={showChoices ? "locale-gateway__choices is-shown" : "locale-gateway__choices"}>
        <a href="./en/">English</a>
        <a href="./vi/">Tiếng Việt</a>
      </div>
    </main>
  );
}
