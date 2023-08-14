"use server";

import { revalidatePath } from "next/cache";
import Community from "../models/comunity.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface CreateThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: CreateThreadParams) {
  console.log({ path });
  try {
    connectToDB();

    ///// TODO:: add community

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      commmunity: communityIdObject, //assign communityId if provided or null if posted on personal account
    });

    // update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      // also update the community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread ${error.message}`);
  }
}

export async function fetchThreads({ pageNumber = 1, pageSize = 20 }) {
  connectToDB();

  // calculate number of posts to skip depending on page
  const skipAmount = (pageNumber - 1) * pageSize;

  // fetch top-level threads i.e parents -- a thread that is not a coment/reply
  const threadsQuery = Thread.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({ path: "community", model: Community })
    .populate({
      path: "children", // populate the children field
      populate: {
        path: "author", // populate the author field within the children
        model: User,
        select: "_id name parentId image", // select only _id, name, parentId and image form author
      },
    });

  // calculate the total number of top-level threads -- not comments or replies
  const totalThreadCount = await Thread.countDocuments({
    parentId: {
      $in: [null, undefined],
    },
  });

  const threads = await threadsQuery.exec();

  const isNext = totalThreadCount > skipAmount + threads.length;

  return { threads, isNext };
}

async function fetchAllChildThreads({
  threadId,
}: {
  threadId: string;
}): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];

  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread.id);

    console.log({ descendants });
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread({ id, path }: { id: string; path: string }) {
  try {
    connectToDB();

    // Find the thread to be deleted i.e main thread
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads({ threadId: id });

    // Get all descendant thread IDs including the main thread id and child Thread ids
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract author and community ids to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()),
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()),
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // update the user model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // update the community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: { descendantThreadIds } } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchThreadById({ threadId }: { threadId: string }) {
  connectToDB();

  try {
    // TODO:: populate community
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) //populate the author field
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // populate the community field
      .populate({
        path: "children",
        populate: [
          {
            path: "author", //populte author  field within the children
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Error fetching thread ${error.message}`);
  }
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}) {
  connectToDB();

  try {
    // add a comment to thread
    // 1. find original thread by id
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // 2. create a new thread with the comment text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // 3. Save the new thread to db
    const savedCommentThread = await commentThread.save();

    // 4. Update the original thread to include new comment
    originalThread.children.push(savedCommentThread._id);

    // 5. Save original thread
    await originalThread.save();

    // 6. Revalidatepath
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to thread ${error.message}`);
  }
}
