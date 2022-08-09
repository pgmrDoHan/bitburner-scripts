async function getSelectedRam(ns) {
	const ramArg = ns.args.indexOf("-R");
	if (ns.args.length > 1 && ramArg !== -1) {
		// Exist Server argument
		if (await ns.prompt(`Do you want to purchase Server having ${ns.args[ramArg + 1]}GB Ram?`) === true) {
			return ns.args[ramArg + 1];
		}else{return "[Warning] Try again"}
	} else {
		// Not Exist
		return await ns.prompt("How many Ram to want to purchase Server?",{type: "select",choices:[
			8,16,32
		]});
	}
}

async function getSelectedServer(ns) {
	const serverArg = ns.args.indexOf("-S");
	if (ns.args.length > 1 && serverArg !== -1) {
		// Exist Server argument
		if(ns.serverExists(ns.args[serverArg + 1])){
			if (await ns.prompt(`Do you want to hack Server: ${ns.args[serverArg + 1]}?`) === true) {
				return ns.args[serverArg + 1];
			}else{return "[Warning] Try again"}
		} else {
			return "[Error] Not Exists Server"
		}
	} else {
		// Not Exist
		const serverList = ns.scan("home");
		ns.tprintf("Server Lists");
		ns.tprintf(`Your Hacking Level ${ns.getHackingLevel()}`);
		for (let i = 0; i < serverList.length; i++) {
			let serverName = serverList[i];
			let serverRequiredHackingLevel = ns.getServerRequiredHackingLevel(serverName);
			let serverSecurityLevel = ns.getServerSecurityLevel(serverName);
			let serverNumPortsRequired = ns.getServerNumPortsRequired(serverName);
			ns.tprintf(`ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
Name: ${serverName}
RequiredHackingLevel: ${serverRequiredHackingLevel}
SecurityLevel: ${serverSecurityLevel}
NumPortsRequired: ${serverNumPortsRequired}`);
		}
		return await ns.prompt("Which Server to want to hack?",{type: "select",choices:serverList});
	}
}

async function purchaseHackingServer(ns,buyServer,buyRam,selectedServer) {
	if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(buyRam)) {
        let hostname = await ns.purchaseServer(buyServer, buyRam);
		await ns.scp("hackingTool.js", hostname);
		await ns.exec("hackingTool.js", hostname, parseInt(buyRam/3.05),"-S",`${selectedServer}`);
    }
}

export async function main(ns) {
	const selectedRam = parseInt(await getSelectedRam(ns));
	const selectedServer = await getSelectedServer(ns);
	let i = 0;
	while (i < ns.getPurchasedServerLimit()) {
		await purchaseHackingServer(ns,"pserv-" + i,selectedRam,selectedServer);
		i++;
	}
}
