import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const root = '/tmp/viber-sites-deploy';
const files = [
  ['src/App.tsx', 'http://localhost:5187/src/App.tsx?raw'],
  ['src/lib/util.ts', 'http://localhost:5187/src/lib/util.ts?raw'],
  ['src/data/walkthrough.ts', 'http://localhost:5187/src/data/walkthrough.ts?raw'],
  ['src/ui/ai.tsx', 'http://localhost:5187/src/ui/ai.tsx?raw'],
  ['src/ui/Phone.tsx', 'http://localhost:5187/src/ui/Phone.tsx?raw'],
  ['src/ui/Chrome.tsx', 'http://localhost:5187/src/ui/Chrome.tsx?raw'],
  ['src/ui/Sheet.tsx', 'http://localhost:5187/src/ui/Sheet.tsx?raw'],
  ['src/ui/Bubble.tsx', 'http://localhost:5187/src/ui/Bubble.tsx?raw'],
  ['src/ui/Avatar.tsx', 'http://localhost:5187/src/ui/Avatar.tsx?raw'],
  ['src/ui/AICard.tsx', 'http://localhost:5187/src/ui/AICard.tsx?raw'],
  ['src/ui/WalletChip.tsx', 'http://localhost:5187/src/ui/WalletChip.tsx?raw'],
  ['src/ui/AnimatedNumber.tsx', 'http://localhost:5187/src/ui/AnimatedNumber.tsx?raw'],
  ['src/scenarios/GiftEnvelope.tsx', 'http://localhost:5187/src/scenarios/GiftEnvelope.tsx?raw'],
  ['src/scenarios/SwipeToPay.tsx', 'http://localhost:5187/src/scenarios/SwipeToPay.tsx?raw'],
  ['src/scenarios/ReceiptSplit.tsx', 'http://localhost:5187/src/scenarios/ReceiptSplit.tsx?raw'],
  ['src/scenarios/ScamShield.tsx', 'http://localhost:5187/src/scenarios/ScamShield.tsx?raw'],
  ['src/scenarios/FamilyFund.tsx', 'http://localhost:5187/src/scenarios/FamilyFund.tsx?raw'],
  ['src/scenarios/Transparency.tsx', 'http://localhost:5187/src/scenarios/Transparency.tsx?raw'],
  ['src/scenarios/Invoice.tsx', 'http://localhost:5187/src/scenarios/Invoice.tsx?raw'],
  ['src/index.css', 'http://localhost:5187/src/index.css?raw'],
];

for (const [rel, url] of files) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const text = await res.text();
  const prefix = 'export default ';
  if (!text.startsWith(prefix)) throw new Error(`Could not parse ${url}`);
  const literal = text.slice(prefix.length).replace(/;\s*$/, '');
  const source = eval(literal);
  const out = join(root, rel);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, source);
}
