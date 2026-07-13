import type { ComponentType } from "react";
import { GiftEnvelope } from "../scenarios/GiftEnvelope";
import { SwipeToPay } from "../scenarios/SwipeToPay";
import { ReceiptSplit } from "../scenarios/ReceiptSplit";
import { ScamShield } from "../scenarios/ScamShield";
import { FamilyFund } from "../scenarios/FamilyFund";
import { Transparency } from "../scenarios/Transparency";
import { Invoice } from "../scenarios/Invoice";

export type Pillar = "Activation" | "Moat" | "Money" | "Trust";

export type Scenario = {
  id: string;
  feature: number; // maps to the 10 original key interactions
  pillar: Pillar;
  title: string;
  sub: string; // one-line "what"
  kpi: string; // the single metric to say in the same breath (shown in the list)
  // The research-backed strategy layer (from feature-pitch-list.md + blindspot pass):
  kpiFull: string; // the full metric set to say in the same breath
  versus: string; // vs competitors / why only Viber can build it
  legal: string; // the constraint / consent / regulatory note
  // Usability instrumentation (from usability-metrics-per-interaction.md, HEART lens @ 190M scale):
  metrics: string[]; // the usability metrics to track, mapped to the KPI
  guardrail: string; // the paired guardrail metric that vetoes a false win
  component: ComponentType;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "gift",
    feature: 1,
    pillar: "Activation",
    title: "AI Gift Envelope",
    sub: "Culturally-timed envelope suggested from the conversation.",
    kpi: "Receive-to-send conversion",
    kpiFull: "Receive-to-send conversion, TTFT, CAC ≈ 0 for gifted-in users",
    versus:
      "WeChat hongbao digitised a ritual and bootstrapped hundreds of millions of wallets — card-linking came after users had money to claim. A bank can't run receive-first.",
    legal:
      "Amounts inferred on-device from the chat only; claiming money creates the wallet and triggers the KYC ladder — funds are held until the receiver verifies.",
    metrics: [
      "Suggestion → send conversion (≥ 35% of taps)",
      "Time from sparkle-tap to sent (< 20s)",
      "Receive → first send within 7 / 30 days",
      "Gifted-user D30 funded retention",
    ],
    guardrail: "Amount-appropriateness — drastic-edit / dismiss rate (wrong cultural amount)",
    component: GiftEnvelope,
  },
  {
    id: "swipe",
    feature: 2,
    pillar: "Moat",
    title: "Swipe to Pay",
    sub: "Drag a message right past 75% to send — money lives in the thread.",
    kpi: "Time to first transaction",
    kpiFull: "Time to first transaction, first-transaction completion, payment success rate",
    versus:
      "The payment object evolves inside the same bubble where the ask happened — banks bounce you to a separate send screen and lose the context.",
    legal:
      "75% threshold + deliberate release prevents accidental sends; biometric step-up (PSD2 SCA) fires on new recipient or high amount, not every tap.",
    metrics: [
      "Swipe-completion rate (past the 75% threshold)",
      "Time-to-send · gesture discoverability (% who ever swipe)",
      "First-swipe-payment rate (TTFT proxy)",
      "p95 gesture latency, by device tier",
    ],
    guardrail: "Accidental-send rate — sends later undone / disputed (vetoes a lower threshold)",
    component: SwipeToPay,
  },
  {
    id: "split",
    feature: 3,
    pillar: "Moat",
    title: "AI Receipt Split",
    sub: "Scan a receipt, match who ordered what, adjust and recalc live.",
    kpi: "Network density",
    kpiFull: "Network density (contacts you transact with), split-completion rate",
    versus:
      "Splitwise / Tricount track the split but move no money; Revolut group bills lack the conversational context. Only the messenger sees the receipt in the thread.",
    legal:
      "On-device OCR on the shared photo and this group only — no photo-library access, no cross-conversation reading.",
    metrics: [
      "Item-detection accuracy (1 − correction rate)",
      "Participants per split (density driver)",
      "New-contact-transacted rate (net-new density)",
      "Split-completion — everyone pays",
    ],
    guardrail: "OCR correction / post-scan abandon rate (accuracy below the trust bar)",
    component: ReceiptSplit,
  },
  {
    id: "fund",
    feature: 5,
    pillar: "Moat",
    title: "Family Fund",
    sub: "AI assembles the group pot from the chat — target, collected, remaining.",
    kpi: "Group-payment adoption",
    kpiFull: "Group-payment adoption, family-network acquisition, network density",
    versus:
      "No competitor owns structured group money with movement. It weaponises Viber's group graph — the one surface banks can't follow; the UA skin becomes a fraud-checked donation tracker.",
    legal:
      "Reads group money-talk with the group's consent; the pot is safeguarded e-money (Paynetics), with organiser history visible for trust.",
    metrics: [
      "Fund-creation rate from detected money-talk",
      "Contributors per fund",
      "Net-new funded wallets per fund (family acquisition)",
      "Contribution-completion rate",
    ],
    guardrail: "False-detection dismiss rate (nagging) · 🇺🇦 fund report / flag rate",
    component: FamilyFund,
  },
  {
    id: "scam",
    feature: 4,
    pillar: "Trust",
    title: "Scam Shield",
    sub: "Reads the conversation around a payment and pauses impersonation scams.",
    kpi: "Fraud loss × false-positives",
    kpiFull: "Fraud loss rate × false-positive block rate, scam-interruption acceptance rate",
    versus:
      "Revolut's fraud AI (40B events) works on transactions; only a messenger can work on the conversation around a payment. Nobody has shipped conversation-level scam AI.",
    legal:
      "APP-fraud liability is shifting to platforms. It never auto-blocks — it pauses and asks; signals are on-device (message pattern + saved-contact number match) only.",
    metrics: [
      "Interruption-acceptance rate (user blocks / verifies)",
      "False-positive rate — legit threads flagged",
      "Detection recall · value of fraud prevented",
      "“Why flagged?” open rate (transparency)",
    ],
    guardrail: "The fraud-loss ↔ false-positive frontier (over-blocking erodes trust too)",
    component: ScamShield,
  },
  {
    id: "transparency",
    feature: 6,
    pillar: "Trust",
    title: "AI Transparency",
    sub: "Every AI card shows exactly what it used — and lets you delete it.",
    kpi: "AI opt-in rate",
    kpiFull: "AI opt-in rate, privacy-segment retention (Germany)",
    versus:
      "Revolut AIR's zero-data-retention stance, taken further into visible UI. Sell control, not magic — the feature built for Viber Pay's hardest live market.",
    legal:
      "EU AI Act Art. 50 transparency made literal: on-device, opt-in, with delete-reasoning honouring the spirit of GDPR Art. 17.",
    metrics: [
      "AI-feature opt-in rate (per market)",
      "“Why AI?” open rate · comprehension SEQ",
      "Delete-reasoning usage (control exercised)",
      "Privacy-segment (🇩🇪) AI-feature retention",
    ],
    guardrail: "Control vs. conversion — does disclosure drop downstream usage?",
    component: Transparency,
  },
  {
    id: "invoice",
    feature: 7,
    pillar: "Money",
    title: "Invoice Lifecycle",
    sub: "Draft → Sent → Viewed → Paid → Settled, in-thread and myDATA-compliant.",
    kpi: "Merchant activation",
    kpiFull: "Merchant activation, time-to-first-sale, take-rate revenue, settlement time",
    versus:
      "Meta Business Agent assumes a catalog; GCash assumes an app. Viber monetises sellers who only have chats — the +65% PH MSME wave — and the invoice lands where the deal was struck.",
    legal:
      "Greek myDATA / AADE e-invoicing built in as UX, not a burden; merchant opt-in, processes the merchant's own outbound messages only (no customer-side reading), GDPR-clean.",
    metrics: [
      "Merchant activation — first invoice sent",
      "Viewed → paid conversion (buyer friction)",
      "Settlement time p50 / p95",
      "2nd-invoice rate · merchant D90 retention",
    ],
    guardrail: "Buyer-side friction + compliance-filing failure rate (🇬🇷 myDATA)",
    component: Invoice,
  },
];

export const PILLARS: { key: Pillar; label: string; blurb: string }[] = [
  { key: "Activation", label: "Activation", blurb: "Get money in — receive-first, wallet created on claim." },
  { key: "Moat", label: "Moat", blurb: "The group graph banks structurally can't follow." },
  { key: "Money", label: "Money", blurb: "Monetization — merchants pay, P2P stays free." },
  { key: "Trust", label: "Trust", blurb: "The layer that makes AI money safe to accept." },
];

/** The 10 original key interactions — 1–7 are full scenarios above; 8–10 are motion patterns shown within them. */
export const KEY_INTERACTIONS = [
  "AI suggestion expands from a message",
  "Swipe to pay",
  "AI receipt split",
  "Scam Shield protects",
  "Family Fund progress",
  "AI transparency sheet",
  "Invoice lifecycle",
  "Money-transfer animation",
  "Pull / drag to pay",
  "Predictive action chips",
];
