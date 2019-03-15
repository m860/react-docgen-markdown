import {getComponentInfo, generateDocString, generateTableContent} from "../src/utils";
import path from "path"
import {walk} from "walk"

test("generate doc", () => {
    const componentPath = path.resolve(__dirname, "components/TestComponent.js");
    const info = getComponentInfo(componentPath);
    // console.log(info);
    const str = generateDocString(info);
    // console.log(str);
    expect(str).toEqual(expect.stringContaining("测试组件"));
    expect(str).toEqual(expect.stringContaining("__author : m860__"));
    expect(str).toEqual(expect.stringContaining("- `name` **string** 姓名"));
    expect(str).toEqual(expect.stringContaining("- `age?` **number** 年龄"));
    expect(str).toEqual(expect.stringContaining("- `getName` **()=>string**"));
    expect(str).toEqual(expect.stringContaining("- `getAge` **()=>number | undefined**"));
    expect(str).toEqual(expect.stringContaining("- `setAge` **(age:number)=>void**"));
    expect(str).not.toEqual(expect.stringContaining("- `_aPrivateMethod`"));
    expect(str).not.toEqual(expect.stringContaining("- `ignoreMethod`"));
});

// /**
//  * react-docgen bug 这样定义的组件不能被发现
//  */
// test("test Pure Function Component", () => {
//     const componentPath = path.resolve(__dirname, "components/nest/Test2Component.js");
//     const info = getComponentInfo(componentPath);
//     console.log(info);
//     const str = generateDocString(info);
//     // console.log(str);
// });

test("table-content", (callback) => {
    const walker = walk(path.resolve(__dirname, "doc"), {
        followLinks: false
    });
    let filenames = [];
    walker.on("file", (root, {name}, next) => {
        filenames.push({filename: path.join(root, name)});
        next();
    });
    walker.on("end", () => {
        const tableContent = generateTableContent(filenames);
        const filename = filenames[0].filename;
        const name = path.basename(filename, ".md");
        expect(tableContent).toEqual(expect.stringContaining(`- [${name}](#${name.toLowerCase()})`));
        callback();
    });
});