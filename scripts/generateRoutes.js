const fs = require("fs");
const path = require("path");

function defaultBots() {
  return [
    { route: "bind-ai" },
    { route: "web-search" },
    { route: "code-generation" },
    { route: "661cacc79657814effd8db6c" },
    { route: "664aaf841bccad5bb77c96ab" },
    { route: "660f2def795718a92af22fc1" },
  ];
}

function getRoutes(dir, basePath = "/") {
  const files = fs.readdirSync(dir);
  let routes = [];
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      routes = [...routes, ...getRoutes(fullPath, path.join(basePath, file))];
    } else if (file === "page.js") {
      // Create the route
      let route = path
        .join(basePath, file.replace("page.js", ""))
        .replace(/\\/g, "/");

      // Remove the (user) directory and any other nested parentheses directories
      route = route.replace(/\/\(.+?\)/g, "");

      // Ensure the route does not end with a slash unless it is the root
      if (route !== "/") {
        route = route.replace(/\/$/, "");
      }

      // Handle dynamic routes (optional: replace [param] with :param for a more user-friendly route, if needed)
      route = route.replace(/\[([^\]]+)\]/g, ":$1");

      // Ensure empty strings are converted to "/"
      if (route === "") {
        route = "/";
      }

      // Push the route
      routes.push(route === "/index" ? "/" : route);
    }
  });
  return routes;
}

const pagesDir = path.join(__dirname, "../src/app");
let routes = getRoutes(pagesDir);

// Handle dynamic routes with defaultBots
const bots = defaultBots();
let updatedRoutes = [];
routes.forEach((route) => {
  if (route.includes(":botId")) {
    bots.forEach((bot) => {
      updatedRoutes.push(route.replace(":botId", bot.route));
    });
  } else {
    updatedRoutes.push(route);
  }
});

const finalRoutes = updatedRoutes.map((route) => ({
  url: route,
  changefreq: "daily", // Default value, can be customized
  priority: 0.8, // Default value, can be customized
}));

fs.writeFileSync(
  path.join(__dirname, "../routes.json"),
  JSON.stringify(finalRoutes, null, 2)
);

console.log("Routes generated:", routes);
