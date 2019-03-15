import {parse} from "react-docgen"
import fs from "fs"
import {parse as jsdocParse} from "doctrine"
import template from "./template"
import {walk} from "walk"
import type {TableContent, TableContentItem} from "./types";
import Handlebars from "handlebars"
import path from "path";

const KEY_DESCRIPTION = "description";
const KEY_DOCBLOCK = "docblock";

function isObject(data) {
    return Object.prototype.toString.call(data) === Object.prototype.toString.call({});
}

function parseDesc(info: Object) {
    for (let key in info) {
        if (key === KEY_DESCRIPTION) {
            if (typeof info[key] === "string") {
                info[key] = jsdocParse(info[key]);
            }
        }
        else if (key === KEY_DOCBLOCK) {
            if (typeof info[key] === "string") {
                info[key] = jsdocParse(info[key])
            }
        }
        else if (isObject(info[key])) {
            parseDesc(info[key]);
        }
        else if (info[key] instanceof Array) {
            info[key].forEach(item => {
                if (isObject(item)) {
                    parseDesc(item)
                }
            })
        }
    }
}

export function getComponentInfo(filename): ?Object {
    const content = fs.readFileSync(filename, "utf8");
    try {
        let info = parse(content);
        parseDesc(info)
        return info;
    }
    catch (ex) {
        return null;
    }
}

export function generateDocString(info: Object): string {
    if (info) {
        return template(info);
    }
    return null;
}

export function generateTableContent(data: Array<TableContent>): string {
    const content = fs.readFileSync(path.resolve(__dirname, "./table-content.handlebars"), "utf8");
    Handlebars.registerHelper("lowercase", (value) => {
        if (value && typeof value === "string" && value.length > 0) {
            return value.toLowerCase();
        }
        return null;
    });
    const template = Handlebars.compile(content);
    const context = {
        content: data.map((item: TableContent): TableContentItem => {
            return {
                name: path.basename(item.filename, ".md")
            };
        })
    };
    return template(context);
}