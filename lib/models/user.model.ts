import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  id: string;
  username: string;
  name: string;
  image?: string;
  bio?: string;
  onboarded: boolean;
  communities: ICommunity[];
  threads: IThread[];
}

interface ICommunity extends Document {
  id: string;
  name: string;
  members: IUser["_id"][];
}

interface IThread extends Document {
  text: string;
  parentId: string | null;
  createdAt: string;
  children: { author: { image: string } }[];
  author: { name: string; image: string; id: string };
  community: { id: string; name: string; image: string } | null;
  id: string;
  name: string;
  members: IUser["_id"][];
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: { type: Boolean, default: false },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
