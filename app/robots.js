const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/dashboard/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
