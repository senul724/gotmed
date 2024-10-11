"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { env } from "@/env";
import { Dialog, DialogPanel } from "@headlessui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SetStateAction } from "jotai";
import { Dispatch } from "react";

export default function LoginModal(
  props: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
  },
) {
  const { isOpen, setIsOpen } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-full items-center justify-center p-4 backdrop-blur-lg bg-black/30">
        <DialogPanel className="max-w-lg w-full space-y-4 bg-white p-12 rounded-lg">
          <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <div className="flex items-center justify-center w-full px-5 sm:px-0">
              <div className="flex bg-white rounded-lg overflow-hidden max-w-sm lg:max-w-4xl w-full">
                <div className="w-full">
                  <p className="text-3xl text-black text-center ">
                    Hey there!
                  </p>
                  <p className="text-lg text-black text-center bg-gray-200 my-5">
                    We hate to waste your Presciuos time! So just oneclick to
                    onboard
                  </p>
                  <SignButton />
                </div>
              </div>
            </div>
          </GoogleOAuthProvider>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

function SignButton() {
  const authorizeLogin = async (token: string) => {
    const response = await fetch("/api/auth/gauth", {
      method: "POST",
      headers: {
        "X-GOOGLE-ID-TOKEN": token,
      },
    });

    if (!response.ok) {
      console.error("failed\n");
      return;
    }

    console.log("success\n");
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      toast.loading("innin........");
      await authorizeLogin(tokenResponse.code);
      toast.dismiss();
    },
    flow: "auth-code",
  });
  return (
    <button
      onClick={() => login()}
      className="flex px-5 justify-center w-full py-3 border bg-blue-500 hover:scale-105"
    >
      <div className="min-w-[30px] shadow">
        <svg className="h-10 w-10" viewBox="0 0 40 40">
          <path
            d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
            fill="#FFC107"
          />
          <path
            d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
            fill="#FF3D00"
          />
          <path
            d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
            fill="#4CAF50"
          />
          <path
            d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
            fill="#1976D2"
          />
        </svg>
      </div>
      <div className="flex w-full justify-center">
        <h1 className="whitespace-nowrap text-white text-lg font-bold">
          Sign in with Google
        </h1>
      </div>
    </button>
  );
}
