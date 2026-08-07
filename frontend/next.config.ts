import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pins the project root explicitly. Without this, Next.js can mistakenly
  // infer a different workspace root if it finds another lockfile higher up
  // the filesystem (e.g. in a Downloads or home folder), which breaks
  // Tailwind's ability to resolve its `content` globs correctly.
  outputFileTracingRoot: path.join(__dirname),

  // برای سرعت بیشتر production build (سرور کم‌رمه):
  // لینت و type-check رو جدا اجرا کن (npm run lint / npx tsc --noEmit)
  // نه هر بار موقع build، که هم سریع‌تر میشه هم رم کمتری مصرف می‌کنه.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;


// import type { NextConfig } from "next";
// import path from "path";
//
// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   // Pins the project root explicitly. Without this, Next.js can mistakenly
//   // infer a different workspace root if it finds another lockfile higher up
//   // the filesystem (e.g. in a Downloads or home folder), which breaks
//   // Tailwind's ability to resolve its `content` globs correctly.
//   outputFileTracingRoot: path.join(__dirname),
// };
//
// export default nextConfig;
