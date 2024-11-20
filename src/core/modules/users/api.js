import API from "@core/networking/api";

export const getUsers = () => {
  return API.get("/users").then((response) => response.data);
};
