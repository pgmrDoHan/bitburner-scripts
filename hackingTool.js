async function getSelectedServer(ns) {
	const serverArg = ns.args.indexOf("-S");
	if (ns.args.length > 1 && serverArg !== -1) {
		// Exist Server argument
		if (ns.serverExists(ns.args[serverArg + 1])) {
			if (await ns.prompt(`Do you want to hack Server: ${ns.args[serverArg + 1]}?`) === true) {
				return ns.args[serverArg + 1];
			} else { await ns.alert("[Warning] Try again"); ns.exit(); }
		} else { await ns.alert("[Error] Not Exists Server"); ns.exit(); }
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
		return await ns.prompt("Which Server to want to hack?", { type: "select", choices: serverList });
	}
}

async function hacking(ns, selectedServer) {
	if (ns.hasRootAccess(selectedServer) === false) {
		try {
			for (let i = 0; i < ns.getServerNumPortsRequired(serverName); i++) {
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
		} catch (e) {
			await ns.alert(`[Warning] Can't Get Root Access.\n Error ${e.split("|")[6]}`); ns.exit();
		}
	} else {
		if (ns.getServerSecurityLevel(selectedServer) > ns.getServerMinSecurityLevel(selectedServer) + 5) {
			await ns.weaken(selectedServer);
		} else if (ns.getServerMoneyAvailable(selectedServer) < ns.getServerMaxMoney(selectedServer)) {
			await ns.grow(selectedServer);
		} else {
			await ns.hack(selectedServer);
		}
	}
}

export async function main(ns) {
	// Get Selected Server
	const selectedServer = await getSelectedServer(ns);
	const runType = await ns.prompt("What type do you want to run?", {
		type: "select", choices: [
			"forever",
			"100 times",
			"10000 times",
			"50000 times"
		]
	})
	switch (runType) {
		case 'forever':
			while (true) {
				await hacking(ns, selectedServer);
			}
		case '100 times':
			for (let i = 0; i < 100; i++) {
				await hacking(ns, selectedServer);
			}
		case '10000 times':
			for (let i = 0; i < 10000; i++) {
				await hacking(ns, selectedServer);
			}
		case '50000 times':
			for (let i = 0; i < 50000; i++) {
				await hacking(ns, selectedServer);
			}
	}
}
