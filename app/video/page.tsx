import type { Metadata } from "next";
import VideoClient from "./VideoClient";

export const metadata: Metadata = {
  title: "Video — Muhamad Ramdhani Rachmansyah",
  description:
    "Film wedding sinematik, aftermovie event, dan potret dalam gerak.",
};

export default function VideoPage() {
  return <VideoClient />;
}
