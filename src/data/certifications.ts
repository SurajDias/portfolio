export type Certification = {
  name: string;
  issuer: string;
  /** Official issuer mark, supplied as a monochrome SVG to suit the existing palette. */
  issuerLogoUrl: string;
  /** Replace this placeholder with the credential's public verification URL when available. */
  credentialUrl: string;
  verified: true;
};

const issuerLogo = (slug: string) => `https://cdn.simpleicons.org/${slug}/CBD5E1`;
const credentialPlaceholder = "https://example.com/credentials";

/**
 * Add newly earned credentials here. Keep `credentialUrl` pointed at the
 * issuer's public verification page once it is available.
 */
export const certifications = [
  {
    name: "Introduction to Cybersecurity",
    issuer: "Cisco",
    issuerLogoUrl: issuerLogo("cisco"),
    credentialUrl: credentialPlaceholder,
    verified: true,
  },
  {
    name: "Generative AI with Large Language Models",
    issuer: "Coursera",
    issuerLogoUrl: issuerLogo("coursera"),
    credentialUrl: credentialPlaceholder,
    verified: true,
  },
  {
    name: "Data Science Math Skills",
    issuer: "Coursera",
    issuerLogoUrl: issuerLogo("coursera"),
    credentialUrl: credentialPlaceholder,
    verified: true,
  },
] as const satisfies readonly Certification[];
