"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createThread } from "@/lib/actions/thread.actions";
import { userThreadFormSchema } from "@/lib/validations/userThreadForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface CreatePostFormProps {
  userId: string;
}

const CreatePostForm = ({ userId }: CreatePostFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

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
    try {
      setIsLoading(true);
      await createThread({
        text: values.thread,
        author: userId,
        communityId: null,
        path: pathname,
      });

      router.push("/");
    } catch (error) {
      console.log("CREATE_POST_ERROR", error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      {error && (
        <p className="text-red-500 py-2">
          Something went wrong. Please try again.
        </p>
      )}
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

        <Button
          type="submit"
          className="flex items-center"
          disabled={isLoading}
        >
          Post {isLoading && <Loader className="w-4 h-4 animate-spin ml-2" />}
        </Button>
      </form>
    </Form>
  );
};

export default CreatePostForm;
