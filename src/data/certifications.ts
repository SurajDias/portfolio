export type Certification = {
  name: string;
  issuer: string;
  /** Official issuer mark, supplied as a monochrome SVG to suit the existing palette. */
  issuerLogoUrl: string;
  credentialUrl: string;
  buttonLabel: string;
  verified: true;
};

const issuerLogo = (slug: string) => `https://cdn.simpleicons.org/${slug}/CBD5E1`;

export const certifications = [
  {
    name: "Introduction to Cybersecurity",
    issuer: "Cisco",
    issuerLogoUrl: issuerLogo("cisco"),
    credentialUrl: "https://www.credly.com/badges/93edfa09-eb97-470f-ae0a-02e9c3eed402/public_url",
    buttonLabel: "View Credential",
    verified: true,
  },
  {
    name: "Generative AI with Large Language Models",
    issuer: "DeepLearning.AI × AWS",
    issuerLogoUrl: issuerLogo("coursera"),
    credentialUrl: "https://coursera.org/verify/E25AAH8PTEUX",
    buttonLabel: "View Credential",
    verified: true,
  },
  {
    name: "Data Science Math Skills",
    issuer: "Duke University",
    issuerLogoUrl: issuerLogo("coursera"),
    credentialUrl: "https://coursera.org/verify/H8Z8V4ELE4BE",
    buttonLabel: "View Credential",
    verified: true,
  },
  {
    name: "Gen AI & Cloud Computing Internship",
    issuer: "IBM SkillsBuild × AICTE × BharatCares",
    issuerLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/E7d58cab3f88684f9f8f_ibm_skillsbuild.svg",
    credentialUrl: "https://skills.yourlearning.ibm.com/activity/PLAN-0E0A390A619F",
    buttonLabel: "View Program",
    verified: true,
  },
] as const satisfies readonly Certification[];
