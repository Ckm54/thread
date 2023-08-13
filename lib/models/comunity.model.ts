import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  id: string;
  username: string;
  name: string;
  image?: string;
  bio?: string;
  onboarded: boolean;
  communities: ICommunity[];
  threads: ICommunity[];
}

interface ICommunity extends Document {
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  createdBy: IUser["_id"];
  members: IUser["_id"][];
  threads: IThread["_id"][];
}

interface IThread extends Document {
  id: string;
  text: string;
  author: IUser["_id"];
  children: IThread["_id"];
  createdAt: string;
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

const CommunitySchema: Schema<ICommunity> = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Community: Model<ICommunity> =
  mongoose.models.Community ||
  mongoose.model<ICommunity>("Community", CommunitySchema);

export default Community;
