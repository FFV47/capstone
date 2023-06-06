type DjangoUserData = {
  username: string;
  authenticated: boolean;
  hasAccount: boolean;
};

export const djangoUserData = JSON.parse(
  document.getElementById("userData")?.textContent as string
) as DjangoUserData;
