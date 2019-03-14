/**
 * @overview 文件描述
 * @author jean.h.ma
 */
import {getComponentInfo, generateString} from "../src/utils";
import path from "path"

test("generateString doc", () => {
    const componentPath = path.resolve(__dirname, "TestComponent.js");
    const info = getComponentInfo(componentPath);
    console.log(info);
    const str = generateString(info);
    console.log(str);
})