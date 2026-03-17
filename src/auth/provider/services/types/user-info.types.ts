export type TUserInfo = {
  id: string;
  picture: string;
  name: string;
  email: string;
  provider: string;
  access_token?: string | null;
  refresh_token?: string;
  expires_at?: number;
};
