export const encodePersonId = (personId) => {
  return btoa(personId)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
};

export const decodePersonId = (token) => {
  const base64 = token.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );

  return atob(padded);
};
