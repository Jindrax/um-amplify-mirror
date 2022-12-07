export enum AllowedSocialProfiles{
  FACEBOOK="facebook",
  INSTAGRAM="instagram",
  TIKTOK="tikTok",
  WEBSITE="website",
  WHATSAPP="whatsapp"
}

export type SocialProfiles = {
  [key in AllowedSocialProfiles]?: string
}
