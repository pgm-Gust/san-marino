import ListItem from "@design/ListItem/ListItem";
import LoadingIndicator from "@design/LoadingIndicator/LoadingIndicator";
import { getUsers } from "@core/modules/users/api.js";
import { formatAddress } from "@core/modules/users/utils";
import { useQuery } from "@tanstack/react-query";

const UserList = () => {
  const {
    isLoading,
    isError,
    error,
    data: users,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (isError) {
    return <p>{error}</p>;
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <ul>
        {users.map((user) => (
          <ListItem key={user.id}>
            <p>{user.name}</p>
            <p>{formatAddress(user.address)}</p>
          </ListItem>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
