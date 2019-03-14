/**
 * @overview 文件描述
 * @author jean.h.ma
 */
import {getComponentInfo, generateDocString} from "../src/utils";
import path from "path"

test("generateDocString doc", () => {
    // const componentPath = path.resolve(__dirname, "components/TestComponent.js");
    const componentPath = path.resolve(__dirname, "components/nest/NestComponent.js");
    const info = getComponentInfo(componentPath);
    console.log(info);
    const str = generateDocString(info);
    console.log(str);
})