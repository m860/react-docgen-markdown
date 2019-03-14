/**
 * @overview 文件描述
 * @author jean.h.ma
 */
import {getComponentInfo, build} from "../src/utils";
import path from "path"

test("build doc", () => {
    const componentPath = path.resolve(__dirname, "TestComponent.js");
    const info = getComponentInfo(componentPath);
    console.log(info);
    const str = build(info);
    console.log(str);
})