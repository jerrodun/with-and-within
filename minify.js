const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

// ! just .js and .css files but IGNORES existing .min files
const files = fs.readdirSync("assets").filter((file) => {
  return (
    (file.endsWith(".js") || file.endsWith(".css")) &&
    !file.endsWith(".min.js") &&
    !file.endsWith(".min.css")
  );
});

files.forEach((file) => {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const outputFile = `assets/${base}.min${ext}`;

  try {
    esbuild.buildSync({
      entryPoints: [`assets/${file}`],
      outfile: outputFile,
      minify: true,
    });
    console.log(`Minified: ${file} → ${outputFile}`);
  } catch (error) {
    console.error(`Error minifying ${file}:`, error);
  }
});
