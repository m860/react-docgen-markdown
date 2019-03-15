import * as React from "react"

type Props = {
    renderIcon?: Function,
    children: React.Node
};


function Test2(props: Props) {
    if (props.renderIcon) {
        return props.renderIcon();
    }
    return props.children;
}

/**
 * 测试纯函数组件,直接返回children
 */
export default React.memo(Test2);