import {
    scrapArgs,
    scpAllScript,
    scanAnalyze
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

    const serverList = scanAnalyze(ns)['list'];
    const exceptServer = await ns.prompt("Which Server except to run hacking Tool. foo, bar ...", {
        type: "text"
    })
    
    for (let i = 0; i < serverList.length; i++) {
        if (exceptServer.split(", ").indexOf(serverList[i]) === -1) {
            const [totalRam, ramUsed] = ns.getServerRam(serverList[i]);
            const threadCount = parseInt((totalRam - ramUsed) / ns.getScriptRam("hackingTool.js", "home"));
            await scpAllScript(ns,serverList[i]);
            if (threadCount > 0) {
                await ns.exec("getAllRootAccess.js", serverList[i], 1);
                await ns.asleep(100);
                await ns.exec("hackingTool.js", serverList[i], threadCount, "-S", selectedServer);
            } else {
                await ns.print(`[WARNING] Server '${serverList[i]}' should have more Ram.`);
            }
        }
    }
}