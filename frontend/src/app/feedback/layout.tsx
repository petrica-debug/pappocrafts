import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback",
  description: "Send feedback, report a bug, or suggest improvements for PappoShop.",
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
