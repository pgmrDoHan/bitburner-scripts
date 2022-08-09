import {
    scrapArgs
} from './scriptLib';

export async function main(ns) {
    let selectedServer = await scrapArgs(ns, "-S");
    if (selectedServer === -1) {
        const serverList = ns.scan(await ns.getHostname());
        selectedServer = await ns.prompt("Which Server to want to hack?", {
            type: "select",
            choices: serverList
        });
    }

    const serverList = ns.scan(ns.getHostname());
    const exceptServer = await ns.prompt("Which Server except to run hacking Tool. foo, bar ...", {
        type: "text"
    })
    for (let i = 0; i < serverList.length; i++) {
        if (ns.hasRootAccess(serverList[i]) !== false && exceptServer.split(", ").indexOf(serverList[i]) === -1) {
            const [totalRam, ramUsed] = ns.getServerRam(serverList[i]);
            await ns.scp("hackingTool.js", "home", serverList[i]);
            await ns.scp("scriptLib.js", "home", serverList[i]);
            await ns.exec("hackingTool.js", serverList[i], parseInt((totalRam - ramUsed) / ns.getScriptRam("hackingTool.js", "home")), "-S", selectedServer);
        }
    }
}