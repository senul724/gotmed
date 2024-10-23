import { Metadata } from "next";
import DashView from "./_components/DashView";

export const metadata: Metadata = {
  title: "pharm aid",
};

export default function Home() {
  return (
    <>
      <DashView />
    </>
  );
}
