import {
	scrapArgs,
	hacking
} from './lib/scriptLib';

export async function main(ns) {
	let selectedServer = parseInt(await scrapArgs(ns, "-S"));
	if (selectedServer === -1) {
		const serverList = ns.scan(ns.getHostname());
		selectedServer = ns.prompt("Which Server to want to hack?", {
			type: "select",
			choices: serverList
		});
	}
	while (true) {
		if (ns.hasRootAccess(selectedServer) !== false) {
			await hacking(ns, selectedServer);
		}
	}
}