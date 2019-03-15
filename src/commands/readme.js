import path from "path";
import {walk} from "walk"
import fs from "fs"
import {generateTableContent} from "../utils";

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
        },
        "table-content": {
            default: false,
            type: "boolean"
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
        let filenames = [];

        const walker = walk(src, {
            followLinks: false
        });
        walker.on("file", (root, {name}, next) => {
            const filename = path.join(root, name);
            filenames.push({filename});
            //insert new doc
            const content = fs.readFileSync(filename, "utf8");
            strs.push(content);
            next();
        });
        walker.on("end", () => {
            strs.push(end);
            if (argv["table-content"]) {
                //生成table content
                strs.splice(1, 0, generateTableContent(filenames))
            }
            fs.writeFileSync(readmeFilename, strs.join("\n"), "utf8");
        });
    }
}