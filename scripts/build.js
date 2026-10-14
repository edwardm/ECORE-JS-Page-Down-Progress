"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { JSHINT } = require("jshint");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const sass = require("sass");
const { optimize: optimizeSvg } = require("svgo");
const { minify } = require("terser");
const postcss = require("postcss");
const packageInfo = require("../package.json");

const root = path.resolve(__dirname, "..");
const sourceDirectory = path.join(root, "src");
const outputDirectory = path.join(root, "dist");
const watching = process.argv.includes("--watch");
const banner = `/*! ${packageInfo.name} v${packageInfo.version} | (c) ${new Date().getFullYear()} ${packageInfo.author.name} | ${packageInfo.license} License | ${packageInfo.repository.url} */\n`;
const reloadClients = new Set();

async function listFiles(directory) {
	const entries = await fs.promises.readdir(directory, { withFileTypes: true });
	const files = await Promise.all(entries.map(async (entry) => {
		const file = path.join(directory, entry.name);
		return entry.isDirectory() ? listFiles(file) : [file];
	}));

	return files.flat();
}

function outputPath(file, sourceRoot, destinationDirectory = outputDirectory) {
	return path.join(destinationDirectory, path.relative(sourceRoot, file));
}

async function writeFile(file, contents) {
	await fs.promises.mkdir(path.dirname(file), { recursive: true });
	await fs.promises.writeFile(file, contents);
}

async function buildScripts(files) {
	const scripts = files.filter((file) => path.extname(file) === ".js");

	for (const file of scripts) {
		const source = await fs.promises.readFile(file, "utf8");
		JSHINT(source, {}, file);

		const errors = JSHINT.errors.filter(Boolean);
		if (errors.length) {
			const details = errors.map((error) =>
				`${file}:${error.line}:${error.character} ${error.reason}`
			);
			throw new Error(`JavaScript lint failed:\n${details.join("\n")}`);
		}

		const destination = outputPath(
			file,
			path.join(sourceDirectory, "js"),
			path.join(outputDirectory, "js")
		);
		const headedSource = banner + source;
		const result = await minify(headedSource, {
			format: { comments: /^!/ }
		});

		if (!result.code) {
			throw new Error(`JavaScript minification produced no output for ${file}`);
		}

		await writeFile(destination, headedSource);
		await writeFile(destination.replace(/\.js$/, ".min.js"), result.code + "\n");
	}
}

async function buildStyles(files) {
	const styles = files.filter((file) =>
		/\.(scss|sass)$/.test(file) && !path.basename(file).startsWith("_")
	);

	for (const file of styles) {
		const compiled = sass.compile(file, { style: "expanded" });
		const prefixed = await postcss([
			autoprefixer({ cascade: true, remove: true })
		]).process(compiled.css, { from: file });
		const destination = outputPath(
			file,
			path.join(sourceDirectory, "sass"),
			path.join(outputDirectory, "css")
		)
			.replace(/\.(scss|sass)$/, ".css");
		const headedCss = banner + prefixed.css;
		const minified = await postcss([
			cssnano({ preset: ["default", { discardComments: { removeAll: true } }] })
		]).process(prefixed.css, { from: file });

		await writeFile(destination, headedCss);
		await writeFile(destination.replace(/\.css$/, ".min.css"), minified.css + "\n");
	}
}

async function buildSvgs(files) {
	const svgs = files.filter((file) =>
		path.extname(file).toLowerCase() === ".svg" &&
		path.dirname(file) === path.join(sourceDirectory, "svg")
	);

	for (const file of svgs) {
		const source = await fs.promises.readFile(file, "utf8");
		const result = optimizeSvg(source, { path: file });
		await writeFile(
			outputPath(
				file,
				path.join(sourceDirectory, "svg"),
				path.join(outputDirectory, "svg")
			),
			result.data
		);
	}
}

async function copyFiles(files) {
	const copyDirectory = path.join(sourceDirectory, "copy");
	const copiedFiles = files.filter((file) => file.startsWith(copyDirectory + path.sep));

	for (const file of copiedFiles) {
		await writeFile(outputPath(file, copyDirectory), await fs.promises.readFile(file));
	}
}

async function build() {
	await fs.promises.rm(outputDirectory, { recursive: true, force: true });
	await fs.promises.mkdir(outputDirectory, { recursive: true });

	const files = await listFiles(sourceDirectory);
	await Promise.all([
		buildScripts(files),
		buildStyles(files),
		buildSvgs(files),
		copyFiles(files)
	]);

	console.log("Build complete.");
}

function serve() {
	const contentTypes = {
		".css": "text/css; charset=utf-8",
		".html": "text/html; charset=utf-8",
		".js": "text/javascript; charset=utf-8",
		".svg": "image/svg+xml"
	};

	const server = http.createServer(async (request, response) => {
		try {
			const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
			if (pathname === "/__live_reload") {
				response.writeHead(200, {
					"Cache-Control": "no-cache",
					"Content-Type": "text/event-stream",
					"Connection": "keep-alive"
				});
				reloadClients.add(response);
				request.on("close", () => reloadClients.delete(response));
				return;
			}

			const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
			const file = path.resolve(outputDirectory, relativePath);

			if (file !== outputDirectory && !file.startsWith(outputDirectory + path.sep)) {
				response.writeHead(403).end("Forbidden");
				return;
			}

			let contents = await fs.promises.readFile(file);
			if (path.extname(file) === ".html") {
				const liveReloadScript = '<script>new EventSource("/__live_reload").onmessage = () => location.reload();</script>';
				contents = Buffer.from(contents.toString("utf8").replace(
					"</body>",
					`${liveReloadScript}</body>`
				));
			}

			response.writeHead(200, {
				"Content-Type": contentTypes[path.extname(file)] || "application/octet-stream"
			});
			response.end(contents);
		} catch (error) {
			if (error.code === "ENOENT" || error instanceof URIError) {
				response.writeHead(404).end("Not found");
				return;
			}
			console.error("Demo server request failed:", error);
			response.writeHead(500).end("Internal server error");
		}
	});

	server.on("close", () => reloadClients.clear());
	server.listen(8080, "127.0.0.1", () => {
		console.log("Demo available at http://localhost:8080");
	});
}

function reloadBrowsers() {
	for (const response of reloadClients) {
		response.write("data: reload\n\n");
	}
}

function watchSources() {
	const watchedDirectories = new Set();
	let timer;
	let building = false;
	let buildAgain = false;

	function addWatchers(directory) {
		if (watchedDirectories.has(directory)) return;
		watchedDirectories.add(directory);

		const watcher = fs.watch(directory, (eventType, filename) => {
			if (eventType === "rename" && filename) {
				const changedPath = path.join(directory, filename.toString());
				fs.promises.stat(changedPath).then((stats) => {
					if (stats.isDirectory()) addWatchers(changedPath);
				}).catch((error) => {
					if (error.code !== "ENOENT") {
						console.error(`Could not watch ${changedPath}:`, error);
						process.exitCode = 1;
					}
				});
			}

			clearTimeout(timer);
			timer = setTimeout(runBuild, 100);
		});

		watcher.on("error", (error) => {
			console.error(`Source watcher failed for ${directory}:`, error);
			process.exitCode = 1;
		});
	}

	async function registerDirectories(directory) {
		addWatchers(directory);
		for (const entry of await fs.promises.readdir(directory, { withFileTypes: true })) {
			if (entry.isDirectory()) {
				await registerDirectories(path.join(directory, entry.name));
			}
		}
	}

	async function runBuild() {
		if (building) {
			buildAgain = true;
			return;
		}

		building = true;
		do {
			buildAgain = false;
			try {
				await build();
				reloadBrowsers();
			} catch (error) {
				console.error(error);
				process.exitCode = 1;
			}
		} while (buildAgain);
		building = false;
	}

	registerDirectories(sourceDirectory).catch((error) => {
		console.error("Could not watch source files:", error);
		process.exitCode = 1;
	});

	console.log("Watching src/ for changes.");
}

build().then(() => {
	if (watching) {
		serve();
		watchSources();
	}
}).catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
