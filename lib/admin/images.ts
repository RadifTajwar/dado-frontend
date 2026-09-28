/* The public site renders these images through next/image, which only allows
   the sources in next.config.ts (images.remotePatterns). A pasted URL from
   anywhere else would break the public page, so the admin only accepts these.
   Mirrored in backend/internal/handlers/validate.go. */

const IMAGE_SOURCES = [
  { hostname: "res.cloudinary.com", pathPrefix: "/dzmhtdw6b/" }, // our Cloudinary account (CLOUDINARY_CLOUD_NAME)
  { hostname: "images.unsplash.com", pathPrefix: "/" }, // starter images
]

export function isAllowedImageUrl(value: string) {
  try {
    const url = new URL(value) // resolves "..", so the prefix check can't be walked around
    return (
      url.protocol === "https:" &&
      IMAGE_SOURCES.some((s) => url.hostname === s.hostname && url.pathname.startsWith(s.pathPrefix))
    )
  } catch {
    return false
  }
}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

/** The image types the API accepts (backend/internal/handlers/uploads.go). */
export const UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]
