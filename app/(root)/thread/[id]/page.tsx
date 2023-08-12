import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const ThreadDetailsPage = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  // fetch user data from database
  const userInfo = await fetchUser({ userId: user.id });

  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById({ threadId: params.id });
  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={user?.id || ""}
          content={thread.text}
          parentId={thread.parentId}
          createdAt={thread.createdAt}
          comments={thread.comments}
          community={thread.community}
          author={thread.author}
        />
      </div>
    </section>
  );
};

export default ThreadDetailsPage;
