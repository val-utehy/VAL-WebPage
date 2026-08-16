import Image from "next/image";
import { assetPath } from "@/lib/assets";

export function LogoMark({
  compact = false,
  top = "Vision & Learning",
  bottom = "Research Lab",
}: {
  compact?: boolean;
  top?: string;
  bottom?: string;
}) {
  return (
    <div className={compact ? "brand brand--lockup brand--compact" : "brand brand--lockup"}>
      <Image
        src={assetPath("/brand/vl-lab-logo.png")}
        alt="Vision and Learning Lab"
        width={512}
        height={512}
        priority
        style={{ width: compact ? 76 : 118, height: "auto" }}
      />
      <span className="sr-only">{top} {bottom}</span>
    </div>
  );
}
