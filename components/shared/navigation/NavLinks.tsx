"use client";
import { sidebarLinks } from "@/constants";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavLinksProps {
  isFooter?: boolean;
}

const NavLinks = ({ isFooter = false }: NavLinksProps) => {
  const pathname = usePathname();
  const { userId } = useAuth();
  return (
    <>
      {sidebarLinks.map((link) => {
        if (link.route === "/profile") link.route = `/profile/${userId}`;

        const isActive =
          (!pathname.includes("profile") &&
            pathname.includes(link.route) &&
            link.route.length > 1) ||
          pathname === link.route;

        return (
          <Link
            href={link.route}
            key={link.route}
            className={`${isFooter ? "bottombar_link" : "leftsidebar_link"} ${
              isActive && "bg-primary-500"
            }`}
          >
            <Image src={link.imgURL} alt={link.label} width={24} height={24} />
            <p className="text-light-1 max-lg:hidden">{link.label}</p>
            {isFooter && (
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {/* get only first word of a link to display on tablet devices */}
                {link.label.split(/\s+/)[0]}
              </p>
            )}
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
