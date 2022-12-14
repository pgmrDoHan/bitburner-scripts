async function scrapArgs(ns, arg) {
	const argIndex = ns.args.indexOf(arg);
	if (ns.args.length > 1 && argIndex !== -1) {
		return ns.args[argIndex + 1];
	} else {
		ns.print(`[WARN] Doesn't Have Arg '${arg}'`);
		return -1;
	}
}

async function getRootAccess(ns, selectedServer) {
	if (ns.hasRootAccess(selectedServer) === false) {
		try {
			for (let i = 0; i < ns.getServerNumPortsRequired(selectedServer); i++) {
				switch (i) {
					case 0:
						await ns.brutessh(selectedServer);
						break;
					case 1:
						await ns.ftpcrack(selectedServer);
						break;
					case 2:
						await ns.relaysmtp(selectedServer);
						break;
					case 3:
						await ns.httpworm(selectedServer);
						break;
					case 4:
						await ns.sqlinject(selectedServer);
						break;
				}
			}
			await ns.nuke(selectedServer);
			ns.print(`[INFO] Get '${selectedServer}' Root Access`);
			return 1;
		} catch (e) {
			ns.print(`[ERROR] ${e.split("|")[6]}`);
			return -1;
		}
	} else {
		ns.print(`[INFO] Already Root Access '${selectedServer}'`);
		return -1;
	}
}

async function serverHacking(ns, selectedServer) {
	if (ns.getServerSecurityLevel(selectedServer) > ns.getServerMinSecurityLevel(selectedServer) + 5) {
		await ns.weaken(selectedServer);
	} else if (ns.getServerMoneyAvailable(selectedServer) < ns.getServerMaxMoney(selectedServer)) {
		await ns.grow(selectedServer);
	} else {
		await ns.hack(selectedServer);
	}
}

function scanAnalyze(ns, maxDepth = Infinity, device = ns.getHostname()) {
    let discovered = [device];
    function scan (device, depth = 1) {
        if(depth > maxDepth) return {};	
        const localTargets = ns.scan(device).filter(newDevice => !discovered.includes(newDevice));	
        discovered = [...discovered, ...localTargets];
        return localTargets.reduce((acc, device) => ({...acc, [device]: scan(device, depth + 1)}), {});
    }
    const network = scan(device);
    return {"list":discovered.slice(1),"dict":network};
}

async function scpAllScript(ns,selectedServer){
	await ns.scp("hackingTool.js", "home", selectedServer);
	await ns.scp("runHackingTool.js", "home", selectedServer);
	await ns.scp("getAllRootAccess.js", "home", selectedServer);
	await ns.scp("scriptLib.js", "home", selectedServer);
}

export {
	scrapArgs,
	getRootAccess,
	serverHacking,
	scpAllScript,
	scanAnalyze
}