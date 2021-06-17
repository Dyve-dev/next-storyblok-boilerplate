import type { NextApiRequest, NextApiResponse } from "next";
import Storyblok from "../../lib/storyblok";

const TOKEN =
  String(process.env.STORYBLOK_PREVIEW_TOKEN) ||
  "some-random-string-here-149578";
export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.debug("Preview.ts", req.query);
  const { slug = "", secret = "" } = req.query;
  // get the storyblok params for the bridge to work
  const params = req.url ? req.url.split("?") : [];

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  let { data } = await Storyblok.get(`cdn/stories/${slug}`, {
    version: "draft",
    cv: Date.now(),
  });

  if (!(data && data.story)) {
    return res.status(401).json({ message: "Story does not exist." });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Set cookie to None, so it can be read in the Storyblok iframe
  let cookies = (res.getHeader("Set-Cookie") as string[]) || [];

  res.setHeader(
    "Set-Cookie",
    cookies.map((cookie) =>
      cookie.replace("SameSite=Lax", "SameSite=None;Secure")
    )
  );

  // Redirect to the path from entry
  res.redirect(`/${slug}?${params[1]}`);
}
