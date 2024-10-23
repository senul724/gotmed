"use client";

import { ReactNode } from "react";

export default function ResponseCard(
  {
    title,
    total,
    children,
  }: {
    title: string;
    total: string;
    children: ReactNode;
  },
) {
  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default flex flex-col sm:flex-row">
      <div className="w-1/2 p-2 flex flex-col  justify-center">
        <p className="text-black text-xl font-semibold">Pannipitiya nursing home</p>
        <p>4.5 star</p>
        <p className="mt-4">2.4 km away</p>
        <p>0701024494</p>
      </div>

      <div className="mt-4 flex flex-col  items-center justify-between w-1/2">
        <div className="flex items-center justify-evenly w-full h-full">
          <button className="rounded-lg bg-meta-10 text-lg font-semibold text-white py-1 px-4">
            Get direction
          </button>
          <button className="rounded-lg bg-success text-lg font-semibold text-white py-1 px-4">
            Accept Response
          </button>
        </div>
      </div>
    </div>
  );
}
