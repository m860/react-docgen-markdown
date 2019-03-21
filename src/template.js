/**
 * @overview 文件描述
 * @author jean.h.ma
 */
import Handlerbars from "handlebars"
import fs from "fs"
import path from "path"

Handlerbars.registerHelper("tag", (value, tagName, option) => {
    if (value) {
        if (tagName === "description") {
            if (value.description && value.description.length > 0) {
                return value.description
            }
        }
        const tag = value.tags.find(f => f.title === tagName);
        if (tag) {
            return tag.description;
        }
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
})

export default Handlerbars.compile(fs.readFileSync(path.resolve(__dirname, "./doc.handlebars"), "utf8"));