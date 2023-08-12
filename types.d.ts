interface UserInfoType {
  id: string;
  objectId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
}

interface ThreadResponse {
  id: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
}
