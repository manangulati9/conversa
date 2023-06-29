"use client";

import { useInitHome } from "@/lib/hooks";
import Home from "./home/page";

export default function () {
  useInitHome();
  return (
    <>
      <Home />
    </>
  );
}
