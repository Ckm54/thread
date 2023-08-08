"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { ChangeEvent } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { userThreadFormSchema } from "@/lib/validations/userThreadForm";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createThread } from "@/lib/actions/thread.actions";

interface CreatePostFormProps {
  userId: string;
}

const CreatePostForm = ({ userId }: CreatePostFormProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof userThreadFormSchema>>({
    resolver: zodResolver(userThreadFormSchema),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const handleCreatePost = async (
    values: z.infer<typeof userThreadFormSchema>
  ) => {
    console.log({ userId });
    await createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreatePost)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          Post
        </Button>
      </form>
    </Form>
  );
};

export default CreatePostForm;
