"use client";

import { Button } from "@/components/ui/button";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { commentValidationSchema } from "@/lib/validations/userThreadForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

interface AddCommentFormProps {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const AddCommentForm = ({
  threadId,
  currentUserId,
  currentUserImg,
}: AddCommentFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const form = useForm<z.infer<typeof commentValidationSchema>>({
    resolver: zodResolver(commentValidationSchema),
    defaultValues: {
      thread: "",
    },
  });

  const handleCreatePost = async (
    values: z.infer<typeof commentValidationSchema>
  ) => {};

  return (
    <div className="comment-form w-full">
      <Image
        src={currentUserImg}
        alt="profile_image"
        width={48}
        height={48}
        className="rounded-full object-cover"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreatePost)}
          className="flex w-full items-center"
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full flex-1 items-start gap-3">
                <FormLabel>
                  {error && (
                    <p className="text-red-500 py-2 text-sm">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    multiple
                    placeholder="Comment..."
                    {...field}
                    className="no-focus text-light-1 outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="comment-form_btn w-[120px] flex items-center justify-center"
            disabled={isLoading}
          >
            Reply {isLoading && <Loader className=" animate-spin ml-2" />}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddCommentForm;
