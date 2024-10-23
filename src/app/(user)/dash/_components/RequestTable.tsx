"use client";

import Loader from "@/components/dash/common/Loader";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa6";

export default function RequestTable() {
  const caption = "Live Orders";
  const orders = [{
    createdAt: Date.now().toLocaleString(),
    request: "dsdsasdadlajldajdasdlkajdada",
    response: 12,
  }];
  const [currentOrder, setCurrentOrder] = useState<
    {
      createdAt: string;
      request: string;
      response: number;
    } | null
  >(null);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <p className="text-xl">{caption}</p>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Date
              </th>
              <th className="min-w-[300px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Request
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Responses
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!orders ? <Loader /> : orders.map((order, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {order.createdAt}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {order.request}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {order.response}/101
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button
                      className="hover:text-primary flex gap-2"
                      onClick={() => setIsOpen(true)}
                    >
                      view
                      <FaRegEye
                        size={25}
                        onClick={() => {
                          setCurrentOrder(order);
                          setIsOpen(true);
                        }}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {
        /**currentOrder &&
        (
          <ViewOrderModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            order={currentOrder}
          />
        )*/
      }
    </div>
  );
}
