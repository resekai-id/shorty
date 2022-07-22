import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../db/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query["slug"];

  if (!slug || typeof slug !== "string") {
    res.statusCode = 404;
    res.send(JSON.stringify({ message: "use a slug" }));

    return;
  }

  const data = await prisma.shortLink.findFirst({
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!data) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Origin", "*");
    res.setHeader(
      "Cache-Control",
      "s.maxage=9999999999, state-while-revalidate"
    );
    res.send(JSON.stringify({ message: "slug not found" }));
    return;
  }

  return res.json(data);
};
