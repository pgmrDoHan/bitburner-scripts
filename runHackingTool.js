import {
    scrapArgs,
    scpAllScript
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
            const threadCount = parseInt((totalRam - ramUsed) / ns.getScriptRam("hackingTool.js", "home"))
            if (threadCount > 0) {
                await scpAllScript(ns,serverList[i]);
                await ns.exec("hackingTool.js", serverList[i], threadCount, "-S", selectedServer);
            } else {
                await ns.print(`[WARNING] Server '${serverList[i]}' should have more Ram.`);
            }
        }
    }
}