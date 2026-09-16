// Set NEXT_BASE_PATH at build time when the app is served from a sub-path
// behind a reverse proxy (e.g. "/building" on dev.nbs.narxoz.kz). Leave unset
// for local dev / anything served from the domain root.
const basePath = process.env.NEXT_BASE_PATH || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath,
  // Standalone output (minimal server.js + pruned node_modules) for the
  // Docker image; the regular `next build` + `next start` local/dev flow
  // ignores this and keeps working as before.
  ...(process.env.DOCKER_BUILD ? { output: 'standalone' } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
