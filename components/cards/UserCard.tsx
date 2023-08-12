import Image from "next/image";
import NavButton from "../shared/navigation/NavButton";

interface UserCardProps {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  resultType: string;
}

const UserCard = ({
  id,
  name,
  username,
  imgUrl,
  resultType,
}: UserCardProps) => {
  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="w-16 h-16 rounded-full object-cover overflow-hidden relative">
          <Image
            src={imgUrl}
            alt={username}
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <NavButton btnText="View" route={`/profile/${id}`} />
    </article>
  );
};

export default UserCard;
