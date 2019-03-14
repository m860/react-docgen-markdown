import path from "path";
import {walk} from "walk"
import fs from "fs"

export default {
    command: "readme <file>",
    describe: "append doc to README.md",
    builder: {
        src: {
            describe: "已经生成好的文档",
            required: true
        },
        cwd: {
            describe: "默认值是 process.cwd()"
        }
    },
    handler: (argv) => {
        const beginTag = "<!--begin react doc markdown-->";
        const endTag = "<!--end react doc markdown-->";
        const cwd = argv.cwd ? argv.cwd : process.cwd();
        const src = path.resolve(cwd, argv.src);
        const readmeFilename = path.join(cwd, argv.file);
        //remove old doc
        const readmeContent = fs.readFileSync(readmeFilename, "utf8");
        const beginPosition = readmeContent.indexOf(beginTag);
        const endPosition = readmeContent.indexOf(endTag);
        const begin = readmeContent.slice(0, beginPosition + beginTag.length);
        const end = readmeContent.slice(endPosition);
        let strs = [begin];
        const walker = walk(src, {
            followLinks: false
        });
        walker.on("file", (root, {name}, next) => {
            const filename = path.join(root, name);
            //insert new doc
            const content = fs.readFileSync(filename, "utf8");
            strs.push(content);
            next();
        });
        walker.on("end", () => {
            strs.push(end);
            fs.writeFileSync(readmeFilename, strs.join("\n"), "utf8");
        });
    }
}