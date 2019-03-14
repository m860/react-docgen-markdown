#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var yargs = _interopDefault(require('yargs'));
var path = _interopDefault(require('path'));
var walk = require('walk');
var fse = _interopDefault(require('fs-extra'));
var reactDocgen = require('react-docgen');
var fs = _interopDefault(require('fs'));
var doctrine = require('doctrine');
var Handlerbars = _interopDefault(require('handlebars'));

/**
 * @overview 文件描述
 * @author jean.h.ma
 */

Handlerbars.registerHelper("tag", (value, tagName, option) => {
    if (tagName === "description") {
        if (value.description && value.description.length > 0) {
            return value.description
        }
    }
    const tag = value.tags.find(f => f.title === tagName);
    if (tag) {
        return tag.description;
    }
    return "";
});

Handlerbars.registerHelper("hastag", function (value, tagName, option) {
    const has = !!value.tags.find(f => f.title === tagName);
    if (has) {
        return option.fn(this);
    }
    return null;
});

Handlerbars.registerHelper("hasnottag", function (value, tagName, option) {
    if (!value) {
        return option.fn(this);
    }
    const has = !!value.tags.find(f => f.title === tagName);
    if (!has) {
        return option.fn(this);
    }
    return null;
});

Handlerbars.registerHelper("forin", function (value, option) {
    let strs = [];
    for (let key in value) {
        strs.push(option.fn({
            ...value[key],
            $key: key
        }));
    }
    return strs.join("")
});

Handlerbars.registerHelper("flow", function (value) {
    if (value) {
        if (value.raw) {
            return value.raw;
        }
        return value.name;
    }
    return "void";
});

var template = Handlerbars.compile(fs.readFileSync(path.resolve(__dirname, "./doc.handlebars"), "utf8"));

const KEY_DESCRIPTION = "description";
const KEY_DOCBLOCK = "docblock";

function isObject(data) {
    return Object.prototype.toString.call(data) === Object.prototype.toString.call({});
}

function parseDesc(info        ) {
    for (let key in info) {
        if (key === KEY_DESCRIPTION) {
            if (typeof info[key] === "string") {
                info[key] = doctrine.parse(info[key]);
            }
        }
        else if (key === KEY_DOCBLOCK) {
            if (typeof info[key] === "string") {
                info[key] = doctrine.parse(info[key]);
            }
        }
        else if (isObject(info[key])) {
            parseDesc(info[key]);
        }
        else if (info[key] instanceof Array) {
            info[key].forEach(item => {
                if (isObject(item)) {
                    parseDesc(item);
                }
            });
        }
    }
}

function getComponentInfo(filename)          {
    const content = fs.readFileSync(filename, "utf8");
    try {
        let info = reactDocgen.parse(content);
        parseDesc(info);
        return info;
    }
    catch (ex) {
        return null;
    }
}

function generateDocString(info        )         {
    if (info) {
        return template(info);
    }
    return null;
}

/**
 * @overview 文件描述
 * @author jean.h.ma
 */

var build = {
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
        const walker = walk.walk(src, {
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
};

var readme = {
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
        const walker = walk.walk(src, {
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
};

yargs.command(build);
yargs.command(readme);

yargs.demandCommand()
    .help()
    .alias("h", "help")
    .alias("v", "version")
    .argv;
