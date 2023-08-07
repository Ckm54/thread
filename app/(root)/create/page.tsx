import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.action";

const CreatePostPage = async () => {
  const user = await currentUser();

  if (!user) return null;

  // fetch the user from database
  const userInfo = await fetchUser({ userId: user.id });

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <div>
      <h1 className="head-text">Create new post</h1>

      {/* <CreatePostForm userId={userInfo._id} /> */}
    </div>
  );
};

export default CreatePostPage;
