import {
	getRootAccess
} from './scriptLib';

export async function main(ns) {
	const serverList = ns.scan(ns.getHostname());
	for (let i = 0; i < serverList.length; i++) {
		await getRootAccess(ns, serverList[i]);
	}
}