# react-docgen-markdown

生成react组件的markdown文档

[![npm version](https://img.shields.io/npm/v/@m860/react-docgen-markdown.svg)](https://www.npmjs.com/package/@m860/react-docgen-markdown)
[![npm license](https://img.shields.io/npm/l/@m860/react-docgen-markdown.svg)](https://www.npmjs.com/package/@m860/react-docgen-markdown)
[![npm download](https://img.shields.io/npm/dm/@m860/react-docgen-markdown.svg)](https://www.npmjs.com/package/@m860/react-docgen-markdown)
[![npm download](https://img.shields.io/npm/dt/@m860/react-docgen-markdown.svg)](https://www.npmjs.com/package/@m860/react-docgen-markdown)
[![Build Status](https://travis-ci.org/m860/react-docgen-markdown.svg?branch=master)](https://travis-ci.org/m860/react-docgen-markdown)
[![Coverage Status](https://coveralls.io/repos/github/m860/react-docgen-markdown/badge.svg?branch=master)](https://coveralls.io/github/m860/react-docgen-markdown?branch=master)

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