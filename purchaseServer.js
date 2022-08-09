import {
	scrapArgs
} from './lib/scriptLib';

export async function main(ns) {
	let selectedRam = parseInt(await scrapArgs(ns, "-R"));
	if (selectedRam === -1) {
		try {
			selectedRam = parseInt(await ns.prompt("How many Ram to want to purchase Server? foo GB", {
				type: "text"
			}));
		} catch (e) {
			ns.print(`[ERROR] ${e.split("|")[6]}`);
		}
	}
	let i = 0;
	while (i < ns.getPurchasedServerLimit()) {
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(selectedRam)) {
			await ns.purchaseServer("pserv-" + i, selectedRam);
		}
		i++;
	}
}