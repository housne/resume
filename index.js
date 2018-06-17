const swig = require("swig");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const postcss = require("postcss");
const precss = require("precss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const pdf = require("html-pdf");

// compile the template
const template = swig.compileFile(path.join(__dirname, "template.html"));
// read data from the json file
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "resume.json"), "utf8")
);
// process css with postcss
postcss([precss, cssnano])
  .process(fs.readFileSync(path.join(__dirname, "style.scss"), "utf8"))
  .then(result => {
    // generate html code
    const output = template({ ...data, css: result.css });
    // save the index.html to dist directory
    mkdirp(path.join(__dirname, "dist"));
    fs.writeFileSync(
      path.join(__dirname, "dist", "index.html"),
      output,
      "utf8"
    );
    // create the pdf file
    pdf
      .create(output, {})
      .toFile(path.join(__dirname, "dist/resume.pdf"), function() {});
  });
