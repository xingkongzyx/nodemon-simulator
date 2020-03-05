#!/usr/bin/env node

const chokidar = require("chokidar");
const debounce = require("lodash.debounce");

// 使用debounce function实现防抖功能,100ms没有新的文件添加才会调用传入的方程
const start = debounce(() => {
	console.log("PROGRAM START");
}, 100);

chokidar
	.watch(".")
	.on("add", start)
	.on("change", () => {
		console.log("FILE CHANGED");
	})
	.on("unlink", () => {
		console.log("FILE DELETED");
		console.log();
	});
