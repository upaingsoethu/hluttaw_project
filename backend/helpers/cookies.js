
export const accessTokenStoreCookies = async (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: process.env.COOKIES_ACCESS_TOKEN_EXPIRES_IN,
    // maxAge: 15 * 60 * 1000, //15 minus
  });
};

export const refreshTokenStoreCookies = async (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: process.env.COOKIES_REFRESH_TOKEN_EXPIRES_IN,
    // maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
export const deleteCookies = async (res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};
