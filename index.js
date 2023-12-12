import fetch from 'node-fetch';
import os from 'os';

const port = Number(process.argv[2] ?? 3200);
const addresses = ['localhost', ...Object.values(os.networkInterfaces()).map(([, { address }]) => address)];

async function test(url) {
    process.stdout.write(url);
    try {
        const res = await fetch(url);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.log(url, res.status, (await res.text()).replace(/\s+/g, ' ').trim().replace(/(?<=.{16}).+/, ' ...'));
    } catch (e) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.error(e && e?.message || e);
    }
}

if (!Number.isFinite(port)) {
    console.log('Invalid port:', process.argv[2]);
    process.exit(1);
} else {
    for (const address of addresses) {
        await test(`http://${address}:${port}`);
    }
}
