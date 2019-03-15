# react-docgen-markdown

生成react组件的markdown文档

[![Build Status](https://travis-ci.org/m860/react-docgen-markdown.svg?branch=master)](https://travis-ci.org/m860/react-docgen-markdown)

## Install

```bash
$ npm i @m860/react-docgen-markdown -D
```

## Simple Usage

```
$ react-docgen-markdown build test/components --output test/doc
$ react-docgen-markdown readme ...
```

[example doc](./test/doc/TestComponent.md)

## 将文档添加到README.md中

- 先在README.md文件中表示文档的插入位置,如:

```
<!--begin react doc markdown-->
<!--end react doc markdown-->
```

- 然后运行命令

```
$ react-docgen-markdown readme test/README.md --src test/doc --table-content
```

[example readme](./test/README.md)