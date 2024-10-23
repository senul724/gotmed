import { Metadata } from "next";
import ResponseCard from "./_components/ResponseCard";
import { TfiWrite } from "react-icons/tfi";
import { AiOutlineFileDone } from "react-icons/ai";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  return (
    <>
      <div className="flex w-full items-center justify-center flex-col">
        <h3>Request 40232323322</h3>
        <p>Oct 20 8:12pm</p>
        <p className="w-full">12 Responses</p>
      </div>
      <div className="flex flex-col w-full mb-10 gap-4">
        <ResponseCard
          title="Total Request"
          total="$45,2K"
        >
          <TfiWrite size={20} />
        </ResponseCard>
        <ResponseCard
          title="Responded requests"
          total="2.450"
        >
          <AiOutlineFileDone size={20} />
        </ResponseCard>
      </div>
    </>
  );
}
