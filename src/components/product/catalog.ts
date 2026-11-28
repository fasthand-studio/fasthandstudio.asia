import { GITHUB_ORG } from "@/lib/github.functions";
import type { TreeIconName } from "@/components/product/TreeIcon";

export type Product = {
  name: string;
  href: string;
  pitch: string;
  repo: string;
  zip: string;
  /** IconTree id used wherever this product needs a visual identity. */
  icon: TreeIconName;
  /** Whether a product page exists in this app. false renders as text, never a link. */
  ready: boolean;
};

export const FASTHAND_OCR: Product = {
  name: "FastHand OCR",
  icon: "eye",
  href: "/products/fasthand-ocr",
  pitch:
    "Send an image, get back the printed text — labels, ID cards, documents, packaging, signs.",
  repo: `https://github.com/${GITHUB_ORG}/Fasthand-ocr`,
  zip: `https://github.com/${GITHUB_ORG}/Fasthand-ocr/archive/refs/heads/main.zip`,
  ready: true,
};

export const FASTNOTIFICATIONS: Product = {
  name: "FastNotifications",
  icon: "device-message",
  href: "/products/fastnotifications",
  pitch:
    "Push notifications you host yourself: a WebSocket per device, a queue for offline phones, no Firebase.",
  repo: `https://github.com/${GITHUB_ORG}/FastNotifications`,
  zip: `https://github.com/${GITHUB_ORG}/FastNotifications/archive/refs/heads/main.zip`,
  ready: true,
};

export const FASTYDISCORD: Product = {
  name: "FastyDiscord",
  icon: "activity",
  href: "/products/fastydiscord",
  pitch:
    "Your GitHub activity in Discord: pushes, pull requests, releases, issues and a weekly report.",
  repo: `https://github.com/${GITHUB_ORG}/FastyDiscord`,
  zip: `https://github.com/${GITHUB_ORG}/FastyDiscord/archive/refs/heads/main.zip`,
  ready: true,
};

export const FASTYBROWSER: Product = {
  name: "FastyBrowser",
  icon: "component",
  href: "/products/fastybrowser",
  pitch:
    "A private, native Linux browser in Go on WebKitGTK: sleeping tabs, a built-in blocker, passkeys and no telemetry.",
  repo: `https://github.com/${GITHUB_ORG}/FastyBrowser`,
  zip: `https://github.com/${GITHUB_ORG}/FastyBrowser/archive/refs/heads/main.zip`,
  ready: true,
};

export const PRODUCTS: Product[] = [FASTHAND_OCR, FASTNOTIFICATIONS, FASTYDISCORD, FASTYBROWSER];
