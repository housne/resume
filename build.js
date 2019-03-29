const nunjucks = require("nunjucks");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const postcss = require("postcss");
const precss = require("precss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const puppeteer = require("puppeteer");
const ncp = require("ncp").ncp;

const render = require("./render");

const DIST_FOLDER = path.join(__dirname, "dist");

render().then(output => {
  // save the index.html to dist directory
  mkdirp.sync(DIST_FOLDER);
  fs.writeFileSync(path.join(DIST_FOLDER, "index.html"), output, "utf8");
  // create the pdf file
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file://${DIST_FOLDER}/index.html`, {
      waitUntil: "networkidle2"
    });
    await page.pdf({
      path: path.join(DIST_FOLDER, "resume.pdf"),
      format: "A4"
    });
    await browser.close();
  })();
});

// copy static folder files to dist folder
ncp(path.join(__dirname, "static"), DIST_FOLDER);
