import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const registerValidator = (options: UsernamePasswordInput) => {
  if (options.username.length == 0) {
    return [
      {
        field: "username",
        message: "username not provided",
      },
    ];
  }
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "email must include '@'",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "username cannot include '@'",
      },
    ];
  }
  return null;
};
