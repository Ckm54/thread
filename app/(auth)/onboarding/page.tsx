import React from "react";
import { currentUser } from "@clerk/nextjs";

import AccountProfileForm from "@/components/forms/AccountProfileForm";
import { userInfo } from "os";

const page = async () => {
  const user = await currentUser();

  const userInfo: any = {};

  const userData: UserInfoType = {
    id: user?.id || "", // will come from the database
    objectId: userInfo?._id, // will be from the database
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="text-white">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete setting up your profile to use AThreads
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfileForm user={userData} btnText="Continue" />
      </section>
    </main>
  );
};

export default page;
