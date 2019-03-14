import {parse} from "react-docgen"
import fs from "fs"
import {parse as jsdocParse} from "doctrine"
import update from "immutability-helper"
import template from "./template"

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

export function getComponentInfo(filename) {
    const content = fs.readFileSync(filename, "utf8");
    let info = parse(content);
    parseDesc(info)
    return info;
}

export function generateString(info: Object): string {
    return template(info);
}