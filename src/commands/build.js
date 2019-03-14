/**
 * @overview 文件描述
 * @author jean.h.ma
 */
import path from "path"
import {walk} from "walk"
import fse from "fs-extra"
import {generateDocString, getComponentInfo} from "../utils";

export default {
    command: `build <src>`,
    describe: "build documentation",
    builder: {
        ignore: {
            describe: "需要忽略的文件或者文件夹,多个以逗号分割"
        },
        extensions: {
            describe: "扩展名",
            default: "js"
        },
        output: {
            describe: "输出目录",
            require: true
        },
        cwd: {
            describe: "默认值是 process.cwd()"
        }
    },
    handler: (argv) => {
        const cwd = argv.cwd ? argv.cwd : process.cwd();
        const src = path.resolve(cwd, argv.src);
        const output = path.resolve(cwd, argv.output);
        const walker = walk(src, {
            filters: argv.ignore ? argv.ignore.split(",") : null,
            followLinks: false
        });
        walker.on("file", (root, {name, type}, next) => {
            const filename = path.join(root, name);
            const relativeFilename = filename.replace(src, "");
            const info = getComponentInfo(filename);
            const doc = generateDocString(info);
            if (doc) {
                let docFilename = path.join(output, relativeFilename);
                const extName = path.extname(docFilename);
                docFilename = docFilename.replace(extName, ".md");
                fse.outputFileSync(docFilename, doc, "utf8");
            }
            next();
        });
    }
}