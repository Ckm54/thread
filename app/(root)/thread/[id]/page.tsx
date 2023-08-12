import ThreadCard from "@/components/cards/ThreadCard";
import AddCommentForm from "@/components/forms/AddCommentForm";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

export const revalidate = 0;

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
          comments={thread.children}
          community={thread.community}
          author={thread.author}
        />
      </div>

      <div className="mt-7">
        <AddCommentForm
          threadId={thread.id}
          currentUserImg={userInfo.image ?? user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user?.id || ""}
            content={childItem.text}
            parentId={childItem.parentId}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            community={childItem.community}
            author={childItem.author}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default ThreadDetailsPage;
