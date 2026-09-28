import type { NextConfig } from "next"

// Where the Go API listens. The browser never talks to it directly.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080"

const nextConfig: NextConfig = {
  reactCompiler: true,

  // The proxy: /api/* on this site is forwarded to the Go server.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }]
  },

  images: {
    remotePatterns: [
      // admin uploads — our account only, so nobody can use this site to resize
      // other people's images. Mirrored in backend/internal/handlers/validate.go.
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/dzmhtdw6b/**" },
      { protocol: "https", hostname: "images.unsplash.com" }, // starter images
    ],
  },
}

export default nextConfig
