import * as React from "react"

type Props = {
    /**
     * 姓名
     */
    name: string,
    /**
     * 年龄
     */
    age?: number
};

type State = {
    age: number
};

/**
 * @description 测试组件
 * @author m860
 *
 * @example
 *
 * <TestComponent name="Lily"/>
 *
 */
export default class TestComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            age: props.age
        };
    }

    getName(): string {
        return this.props.name;
    }

    getAge(): number | undefined {
        return this.props.age;
    }

    setAge(age: number): void {
        this.setState({
            age
        })
    }

    /**
     * @private
     */
    _aPrivateMethod(): void {
    }

    /**
     * @ignore
     */
    ignoreMethod() {
    }

    render() {
        return (
            <div>
                <span>Hello {this.props.name}</span>
            </div>
        );
    }
}