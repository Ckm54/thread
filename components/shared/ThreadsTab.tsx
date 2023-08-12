import { fetchUserThreads } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";

interface ThreadsTabProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({
  currentUserId,
  accountId,
  accountType,
}: ThreadsTabProps) => {
  // fetch threads related to only this account
  const fetchUserThreadsResponse = await fetchUserThreads({
    userId: accountId,
  });

  if (!fetchUserThreadsResponse) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {fetchUserThreadsResponse.threads.map((thread) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          content={thread.text}
          parentId={thread.parentId}
          createdAt={thread.createdAt}
          comments={thread.children}
          community={thread.community} //todo
          author={
            accountType === "User"
              ? {
                  name: fetchUserThreadsResponse.name,
                  image: fetchUserThreadsResponse.image ?? "",
                  id: fetchUserThreadsResponse.id,
                }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
