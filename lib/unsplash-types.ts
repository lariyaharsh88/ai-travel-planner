/** Public photo payload from /api/unsplash/search — safe for the client. */
export type UnsplashPhoto = {
  src: string;
  creditName: string;
  creditUrl: string;
  alt: string;
};
