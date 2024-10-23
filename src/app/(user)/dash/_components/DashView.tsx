"use client";

import React, { ReactNode } from "react";
import { TfiWrite } from "react-icons/tfi";
import { AiOutlineFileDone } from "react-icons/ai";
import RequestTable from "./RequestTable";

export default function DashView() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 grid-cols-4 mb-10">
        <CardDataStats
          title="Total Request"
          total="$45,2K"
        >
          <TfiWrite size={20} />
        </CardDataStats>
        <CardDataStats
          title="Responded requests"
          total="2.450"
        >
          <AiOutlineFileDone size={20} />
        </CardDataStats>
      </div>
      <RequestTable />
    </>
  );
}

const CardDataStats = ({
  title,
  total,
  children,
}: {
  title: string;
  total: string;
  children: ReactNode;
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {total}
          </h4>
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>
    </div>
  );
};
