"use server";

import { revalidatePath } from "next/cache";
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

    const createdThread = await Thread.create({
      text,
      author,
      commmunity: null,
    });

    // update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread ${error.message}`);
  }
}

export async function fetchThreads({ pageNumber = 1, pageSize = 20 }) {
  connectToDB();

  // calculate number of posts to skip depending on page
  const skipAmount = (pageNumber - 1) * pageSize;

  // fetch top-level threads i.e parents
  const threadsQuery = Thread.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalThreadCount = await Thread.countDocuments({
    parentId: {
      $in: [null, undefined],
    },
  });

  const threads = await threadsQuery.exec();

  const isNext = totalThreadCount > skipAmount + threads.length;

  return { threads, isNext };
}
