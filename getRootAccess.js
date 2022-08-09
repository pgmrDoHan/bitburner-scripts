export async function main(ns) {
	const serverList = ns.scan("home");
	for (let i = 0; i < serverList.length; i++) {
		if (ns.hasRootAccess(serverList[i]) === false) {
			try {
				for (let i = 0; i < ns.getServerNumPortsRequired(serverList[i]); i++) {
					switch (i) {
						case 0:
							await ns.brutessh(serverList[i]);
							break;
						case 1:
							await ns.ftpcrack(serverList[i]);
							break;
						case 2:
							await ns.relaysmtp(serverList[i]);
							break;
						case 3:
							await ns.httpworm(serverList[i]);
							break;
						case 4:
							await ns.sqlinject(serverList[i]);
							break;
					}
				}
				await ns.nuke(serverList[i]);
				await ns.alert(`Get Root Access on ${serverList[i]}`)
			} catch (e) {
				await ns.tprintf(`[Warning] Can't Get Root Access.\n Error ${e.split("|")[6]}`); ns.exit();
			}
		}
	}
}
