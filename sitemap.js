const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");

async function generateSitemap() {
  const projectRoot = process.cwd();

  const linksString = fs.readFileSync(
    path.join(projectRoot, "routes.json"),
    "utf-8"
  );

  const routes = JSON.parse(linksString);

  const stream = new SitemapStream({
    hostname: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  });
  return streamToPromise(Readable.from(routes).pipe(stream)).then((data) =>
    data.toString()
  );
}

module.exports = generateSitemap;
