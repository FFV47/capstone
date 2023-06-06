const { writeFile, stat } = require("fs/promises");
const {
  PurgeCSS,
} = require("/home/fernando/.asdf/installs/nodejs/19.1.0/lib/node_modules/purgecss");

async function main() {
  const purgeCSSResult = await new PurgeCSS().purge({
    content: ["**/*.js", "**/*.html"],
    css: ["**/*.css"],
  });

  await Promise.all(
    purgeCSSResult.map(async ({ css, file }) => {
      const initialSize = (await stat(file)).size / 1024;

      await writeFile(file, css);

      const postSize = (await stat(file)).size / 1024;
      console.log(`${file}: ${initialSize} -> ${postSize} KB`);
    })
  );
}

main();
