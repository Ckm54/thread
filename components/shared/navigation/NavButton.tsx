"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

interface NavButtonProps {
  btnText: string;
  route: string;
}

const NavButton = ({ btnText, route }: NavButtonProps) => {
  const router = useRouter();

  return (
    <Button
      className="user-card_btn"
      onClick={() => {
        router.push(route);
      }}
    >
      {btnText}
    </Button>
  );
};

export default NavButton;
