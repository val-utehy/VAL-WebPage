import { redirect } from "next/navigation";

/** Always open the site in English from the root URL. */
export default function Home() {
  redirect("/en");
}
