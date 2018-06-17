const nunjucks = require("nunjucks");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const postcss = require("postcss");
const precss = require("precss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const puppeteer = require("puppeteer");

// read data from the json file
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "resume.json"), "utf8")
);
// process css with postcss
postcss([precss, cssnano])
  .process(fs.readFileSync(path.join(__dirname, "style.scss"), "utf8"))
  .then(result => {
    const template = path.join(__dirname, "template.html");
    // generate html code
    const output = nunjucks.render(template, { ...data, css: result.css });
    // save the index.html to dist directory
    mkdirp.sync(path.join(__dirname, "dist"));
    fs.writeFileSync(
      path.join(__dirname, "dist", "index.html"),
      output,
      "utf8"
    );
    // create the pdf file
    async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file://${path.join(__dirname, "dist/index.html")}`, {
        waitUntil: "networkidle2"
      });
      await page.pdf({
        path: path.join(__dirname, "dist/resume.pdf"),
        format: "A4"
      });
      await browser.close();
    };
  });
