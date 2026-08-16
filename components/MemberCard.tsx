import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/lib/members";
import type { Locale } from "@/lib/i18n";
import { assetPath } from "@/lib/assets";
import { withLocale } from "@/lib/i18n";

export function MemberCard({
  member,
  lang,
  index = 0,
}: {
  member: Member;
  lang: Locale;
  index?: number;
}) {
  return (
    <Link className="person-card person-card--link" href={withLocale(lang, `/people/${member.slug}`)}>
      <div className={`person-avatar person-avatar--${(index % 4) + 1}`}>
        {member.photo ? (
          <Image
            src={assetPath(member.photo)}
            alt={member.displayName}
            width={520}
            height={620}
          />
        ) : (
          <span>{member.initials}</span>
        )}
      </div>
      <h3>{member.displayName}</h3>
      <p>{member.role}</p>
      <small>{member.interests.join(" · ")}</small>
    </Link>
  );
}
