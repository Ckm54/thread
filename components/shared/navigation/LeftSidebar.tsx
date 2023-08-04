import React from "react";
import SignoutBtn from "@/components/shared/SignoutBtn";
import NavLinks from "@/components/shared/navigation/NavLinks";

const LeftSidebar = () => {
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        <NavLinks />
      </div>

      <div className="mt-10 px-6">
        <SignoutBtn isSidebar />
      </div>
    </section>
  );
};

export default LeftSidebar;
