import type { Metadata } from "next";
import DevPage from "@/components/dev/DevPage";

export const metadata: Metadata = {
  title: "Developers · 3DHV",
  description:
    "Meet the developers behind 3DHV. Explore technical contributions, architecture highlights, and direct developer contact details.",
};

export default function Page() {
  return <DevPage />;
}
