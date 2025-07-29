import type { APIResponse, PaginationMetadata } from "@/lib/types/api-response";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  coverImage: string | null;
  bio: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  isActive: boolean;
  isVerified: boolean;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  status: string;
  role: string;
  lastLoginAt: string | null;
  loginCount: number;
  lastPasswordChangeAt: string | null;
  deletedAt: string | null;
  created_at: string;
  updated_at: string;
  followersCount: number;
  followingCount: number;
  newsPostsCount: number;
  feedPostsCount: number;
  socialLinks: Partial<Record<SocialPlatform, string>>;
  alias: string | null; // Thêm trường alias
}

export type FindAllUsersResponse = APIResponse<
  User[],
  PaginationMetadata | undefined
>;

export type FindUserResponse = APIResponse<User, undefined>;

export interface UserConfig {
  id: string;
  userId: string;
  emailNotifications: boolean;
  privacy: string;
}

export type GetSelfUserConfigResponse = APIResponse<UserConfig, undefined>;

export interface UpdateProfileDto {
  name?: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  socialLinks?: Partial<Record<SocialPlatform, string>>;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  city?: string;
  alias?: string;
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum SocialPlatform {
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  X = "x",
  TIKTOK = "tiktok",
  YOUTUBE = "youtube",
  LINKEDIN = "linkedin",
  PINTEREST = "pinterest",
  SNAPCHAT = "snapchat",
  REDDIT = "reddit",
  TUMBLR = "tumblr",
  TWITCH = "twitch",
  DISCORD = "discord",
  GITHUB = "github",
  GITLAB = "gitlab",
  STACK_OVERFLOW = "stackoverflow",
  MEDIUM = "medium",
  SUBSTACK = "substack",
  MASTODON = "mastodon",
  BLUESKY = "bluesky",
  FOURSQUARE = "foursquare",
  VIMEO = "vimeo",
  FLICKR = "flickr",
  BEHANCE = "behance",
  DRIBBBLE = "dribbble",
  SOUNDCLOUD = "soundcloud",
  SPOTIFY = "spotify",
  APPLE_MUSIC = "appleMusic",
  DEVIANTART = "deviantart",
  ARTSTATION = "artstation",
  KICK = "kick",
  WECHAT = "wechat",
  WHATSAPP = "whatsapp",
  TELEGRAM = "telegram",
  LINE = "line",
  SKYPE = "skype",
  QUORA = "quora",
  GOODREADS = "goodreads",
  ETSY = "etsy",
  SHOPIFY = "shopify",
  PATREON = "patreon",
  KO_FI = "koFi",
  BUY_ME_A_COFFEE = "buymeacoffee",
  CASH_APP = "cashApp",
  VENMO = "venmo",
  PAYPAL = "paypal",
  ONLYFANS = "onlyfans",
  FANSLY = "fansly",

  // Các liên kết chung/cá nhân
  WEBSITE = "website",
  PORTFOLIO = "portfolio",
  BLOG = "blog",
}
