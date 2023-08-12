import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

export const revalidate = 0;

export default async function Home() {
  // fetch user's posts using server action
  const response = await fetchThreads({ pageNumber: 1, pageSize: 30 });
  const user = await currentUser();

  return (
    <main>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {response.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {response.threads.map((thread) => (
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id || ""}
                content={thread.text}
                parentId={thread.parentId}
                createdAt={thread.createdAt}
                comments={thread.children}
                community={thread.community}
                author={thread.author}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}
