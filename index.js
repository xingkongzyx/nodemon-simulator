#!/usr/bin/env node

const chokidar = require("chokidar");
const debounce = require("lodash.debounce");
const program = require("caporal");
const fs = require("fs");
const { spawn } = require("child_process");

program
	.version("1.0.0")
	.argument("[filename]", "Name of a file to exectute!")
	// 得到参数后要执行的方程
	.action(async ({ filename }) => {
		// check if the file exists, or will use default file index.js
		const file = filename || "index.js";
		// 检验在文件系统中能否找到这个文件,找不到则报相应的错误
		try {
			await fs.promises.access(file);
			console.log("Open the file", file);
		} catch (error) {
			throw new Error("Could not find the file " + file);
		}

		// 使用debounce function实现防抖功能,100ms没有新的文件添加才会调用传入的方程
		const start = debounce(() => {
            // 第一个参数是要执行的命令行
            // 第二个参数是执行的命令的参数
            // 第三个参数指childprocess执行后得到的log/error等信息能显示出来
			spawn("node", [file], {stdio: 'inherit'})
		}, 1000);

		// Detect when a file changes
		chokidar
			.watch(".")
			.on("add", start)
			.on("change", start)
			.on("unlink", start);
	});

program.parse(process.argv);
