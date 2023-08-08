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
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

interface AccountProfileFormProps {
  user: UserInfoType;
  btnText: string;
}

const AccountProfileForm = ({ user, btnText }: AccountProfileFormProps) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const pathname = usePathname();
  const router = useRouter();

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
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (val: string) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";

        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    // upload image and update user in the database
    const profile_image_blob = values.profile_photo;

    const hasImageChanged = isBase64Image(profile_image_blob);

    if (hasImageChanged) {
      // upload image using uploadthing
      const imageResponse = await startUpload(files);

      if (imageResponse && imageResponse[0].fileUrl) {
        values.profile_photo = imageResponse[0].fileUrl;
      }
    }

    ///// TODO: Update user profile in database
    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname,
    });

    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
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
                  <div className="w-[6rem] h-[6rem] relative">
                    <Image
                      src={field.value}
                      alt="profile_photo"
                      fill
                      priority
                      className="rounded-full object-cover overflow-hidden"
                    />
                  </div>
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
              <FormDescription>Some brief info about you.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          {btnText}
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfileForm;
