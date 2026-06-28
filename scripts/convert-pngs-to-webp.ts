import { readdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { execFile } from 'node:child_process';

const IMAGE_DIR = 'public/img';

function findMagickCommand(): Promise<string> {
	return new Promise((resolve) => {
		execFile('magick', ['--version'], (error) => {
			resolve(error ? 'convert' : 'magick');
		});
	});
}

async function findPngs(dir: string): Promise<string[]> {
	const entries = await readdir(dir, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await findPngs(path)));
		} else if (entry.isFile() && extname(entry.name).toLowerCase() === '.png') {
			files.push(path);
		}
	}

	return files;
}

function convert(command: string, input: string, output: string): Promise<void> {
	const args = command === 'magick' ? ['convert', input, output] : [input, output];

	return new Promise((resolve, reject) => {
		execFile(command, args, (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

async function main() {
	const command = await findMagickCommand();
	const pngs = await findPngs(IMAGE_DIR);

	if (pngs.length === 0) {
		console.log(`No PNG files found in ${IMAGE_DIR}`);
		return;
	}

	console.log(`Found ${pngs.length} PNG file(s) in ${IMAGE_DIR}`);

	let skipped = 0, converted = 0, created = 0;

	for (const png of pngs) {
		const webp = png.replace(/\.png$/i, '.webp');

		const pngStat = await stat(png);
		const webpStat = await stat(webp).catch(() => null);

		if (webpStat && webpStat.mtimeMs >= pngStat.mtimeMs) {
			console.log(`– ${png} (up to date, skipping)`);
			skipped++;
			continue;
		}

		const isNew = !webpStat;

		try {
			await convert(command, png, webp);
			console.log(`✓ ${png} → ${webp}`);
			isNew ? created++ : converted++;
		} catch (error) {
			console.error(`✗ Failed to convert ${png}:`, error);
		}
	}

	console.log(`\nDone — ${created} new, ${converted} converted, ${skipped} skipped.`);
}

main();
