"use client";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface SignoutBtnProps {
  isSidebar?: boolean;
}

const SignoutBtn = ({ isSidebar = false }: SignoutBtnProps) => {
  const router = useRouter();
  return (
    <SignedIn>
      <SignOutButton signOutCallback={() => router.push("/")}>
        <div className={`${isSidebar && "gap-4 p-4"} flex cursor-pointer`}>
          <Image
            src={"/assets/logout.svg"}
            alt="logout"
            width={24}
            height={24}
          />

          {isSidebar && <p className="text-light-2 max-lg:hidden">Logout</p>}
        </div>
      </SignOutButton>
    </SignedIn>
  );
};

export default SignoutBtn;
