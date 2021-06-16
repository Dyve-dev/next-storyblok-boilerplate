import type { NextApiRequest, NextApiResponse } from "next";

export default async function exit(req: NextApiRequest, res: NextApiResponse) {
  const { slug = "" } = req.query;
  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData();

  // set the cookies to None
  let cookies: string[] = [];
  let _cookies = res.getHeader("Set-Cookie") || [];
  if (!Array.isArray(_cookies)) {
    cookies = [String(_cookies)];
  }
  res.setHeader(
    "Set-Cookie",
    cookies.map((cookie) =>
      cookie.replace("SameSite=Lax", "SameSite=None;Secure")
    )
  );

  // Redirect the user back to the index page.
  res.redirect(`/${slug}`);
}
