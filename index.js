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

const DIST_FOLDER = path.join(__dirname, 'dist');

// read data from the json file
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "resume.json"), "utf8")
);
// process css with postcss
postcss([precss, autoprefixer, cssnano])
  .process(fs.readFileSync(path.join(__dirname, "style.scss"), "utf8"))
  .then(result => {
    const template = path.join(__dirname, "template.html");
    // generate html code
    const output = nunjucks.render(template, { ...data, css: result.css });
    // save the index.html to dist directory
    mkdirp.sync(DIST_FOLDER);
    fs.writeFileSync(
      path.join(DIST_FOLDER, "index.html"),
      output,
      "utf8"
    );
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
  ncp(path.join(__dirname, 'static'), DIST_FOLDER)
