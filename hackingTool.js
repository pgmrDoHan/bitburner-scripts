import {
	scrapArgs,
	serverHacking
} from './scriptLib';

export async function main(ns) {
	let selectedHost = await scrapArgs(ns, "-H");
    if (selectedHost === -1) {
        selectedHost = ns.getHostname();
    }

    let selectedServer = await scrapArgs(ns, "-S");
    if (selectedServer === -1) {
        const serverList = ns.scan(selectedHost);
        selectedServer = await ns.prompt("Which Server to want to hack?", {
            type: "select",
            choices: serverList
        });
    }
	while (true) {
		if (ns.hasRootAccess(selectedServer) !== false) {
			await serverHacking(ns, selectedServer);
		}
	}
}