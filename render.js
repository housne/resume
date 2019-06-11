const nunjucks = require("nunjucks");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const postcss = require("postcss");
const precss = require("precss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

module.exports = function() {
  // read data from the json file
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "resume.json"), "utf8")
  );
  // process css with postcss
  return postcss([precss, autoprefixer, cssnano])
    .process(fs.readFileSync(path.join(__dirname, "style.scss"), "utf8"), {
      from: "style.css",
      to: "dist/style.css"
    })
    .then(result => {
      const template = path.join(__dirname, "template.html");
      // generate html code
      return nunjucks.render(template, { ...data, css: result.css });
    });
};
