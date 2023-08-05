"use client";

import React, { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { userFormSchema } from "@/lib/validations/userForm";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

interface AccountProfileFormProps {
  user: UserInfoType;
  btnText: string;
}

const AccountProfileForm = ({ user, btnText }: AccountProfileFormProps) => {
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      profile_photo: user.image || "",
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || "",
    },
  });

  const handleImageChange = (
    e: ChangeEvent,
    fieldChange: (val: string) => void
  ) => {
    e.preventDefault();
  };

  function onSubmit(values: z.infer<typeof userFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-6"
      >
        {/* Image selection  */}
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile_photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src={"/assets/profile.svg"}
                    alt="profile_photo"
                    width={24}
                    height={24}
                    priority
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-400 cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImageChange(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* name input */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* username input */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="JDoe"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* bio input */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  {...field}
                  className="account-form_input no-focus"
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{btnText}</Button>
      </form>
    </Form>
  );
};

export default AccountProfileForm;
