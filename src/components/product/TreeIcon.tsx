import { useEffect, useRef, useState } from "react";
import AndroidIcon from "icon-tree-animate/icons/android";
import CloudAddIcon from "icon-tree-animate/icons/cloud-add";
import CodeIcon from "icon-tree-animate/icons/code";
import ComponentIcon from "icon-tree-animate/icons/component";
import Data2Icon from "icon-tree-animate/icons/data-2";
import DeviceMessageIcon from "icon-tree-animate/icons/device-message";
import DocumentDownloadIcon from "icon-tree-animate/icons/document-download";
import KeySquareIcon from "icon-tree-animate/icons/key-square";
import NotificationIcon from "icon-tree-animate/icons/notification";
import Refresh2Icon from "icon-tree-animate/icons/refresh-2";
import TrashBinIcon from "icon-tree-animate/icons/trash-bin";
import VerifyIcon from "icon-tree-animate/icons/verify";
import WifiIcon from "icon-tree-animate/icons/wifi";
import ClockIcon from "icon-tree-animate/icons/clock";
import EyeIcon from "icon-tree-animate/icons/eye";
import CloudIcon from "icon-tree-animate/icons/cloud";
import ShieldTickIcon from "icon-tree-animate/icons/shield-tick";
import ActivityIcon from "icon-tree-animate/icons/activity";
import CalendarIcon from "icon-tree-animate/icons/calendar";
import CloudLightningIcon from "icon-tree-animate/icons/cloud-lightning";
import FilterRemoveIcon from "icon-tree-animate/icons/filter-remove";
import ChartIcon from "icon-tree-animate/icons/chart";
import CpuIcon from "icon-tree-animate/icons/cpu";
import BucketSquareIcon from "icon-tree-animate/icons/bucket-square";
import LinkSquareIcon from "icon-tree-animate/icons/link-square";
import PeopleIcon from "icon-tree-animate/icons/people";
import BookIcon from "icon-tree-animate/icons/book";
import { useIconMotion } from "@/components/product/icontree";

/** Only IDs verified against the package, mapped to per-icon imports so the bundle carries each one once. */
const registry = {
  android: AndroidIcon,
  "cloud-add": CloudAddIcon,
  code: CodeIcon,
  component: ComponentIcon,
  data: Data2Icon,
  "device-message": DeviceMessageIcon,
  download: DocumentDownloadIcon,
  key: KeySquareIcon,
  notification: NotificationIcon,
  refresh: Refresh2Icon,
  trash: TrashBinIcon,
  verify: VerifyIcon,
  wifi: WifiIcon,
  clock: ClockIcon,
  eye: EyeIcon,
  cloud: CloudIcon,
  "shield-tick": ShieldTickIcon,
  activity: ActivityIcon,
  calendar: CalendarIcon,
  "cloud-lightning": CloudLightningIcon,
  "filter-remove": FilterRemoveIcon,
  chart: ChartIcon,
  cpu: CpuIcon,
  "bucket-square": BucketSquareIcon,
  "link-square": LinkSquareIcon,
  people: PeopleIcon,
  book: BookIcon,
} as const;

export type TreeIconName = keyof typeof registry;

/**
 * Lottie bakes its fills at mount and cannot see a stylesheet colour change, so
 * the colour is read from the wrapper on the client and the icon remounts when
 * the theme changes. The server draws an empty box at the final size.
 */
export function TreeIcon({
  name,
  size = 20,
  motion = "static",
  className = "",
}: {
  name: TreeIconName;
  size?: number;
  motion?: "static" | "hover";
  className?: string;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const [color, setColor] = useState<string | null>(null);
  const allowed = useIconMotion();

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const sync = () => setColor(getComputedStyle(el).color);
    sync();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", sync);
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      media.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, []);

  const Icon = registry[name];

  return (
    <span
      ref={host}
      aria-hidden
      className={`ti inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {color ? (
        <Icon
          key={`${name}-${color}`}
          size={size}
          color={color}
          mode={motion === "hover" ? allowed : "static"}
        />
      ) : null}
    </span>
  );
}
