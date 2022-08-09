import {
    scrapArgs
} from './scriptLib';

export async function main(ns) {
    let selectedServer = parseInt(await scrapArgs(ns, "-S"));
    if (selectedServer === -1) {
        const serverList = ns.scan(ns.getHostname());
        selectedServer = ns.prompt("Which Server to want to hack?", {
            type: "select",
            choices: serverList
        });
    }

    const serverList = ns.scan(ns.getHostname());
    for (let i = 0; i < serverList.length; i++) {
        if (ns.hasRootAccess(serverList[i]) !== false) {
            const [totalRam, ramUsed] = ns.getServerRam(serverList[i]);
            await ns.scp("hackingTool.js", "home", serverList[i]);
            await ns.exec("hackingTool.js", serverList[i], parseInt((totalRam - ramUsed) / ns.getScriptRam("hackingTool.js", "home")), "-S", selectedServer);
        }
    }
}