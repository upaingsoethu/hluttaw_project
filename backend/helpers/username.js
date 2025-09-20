export const getInitialsUsername = (username) =>
  username
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
