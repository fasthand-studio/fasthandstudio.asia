import type { ComponentType, CSSProperties } from "react";

import ActivityIcon from "icon-tree-animate/icons/activity";
import ArrowSwapIcon from "icon-tree-animate/icons/arrow-swap-horizontal";
import BookIcon from "icon-tree-animate/icons/book";
import BoxRemoveIcon from "icon-tree-animate/icons/box-remove";
import BoxTickIcon from "icon-tree-animate/icons/box-tick";
import BoxTimeIcon from "icon-tree-animate/icons/box-time";
import BucketSquareIcon from "icon-tree-animate/icons/bucket-square";
import Chart2Icon from "icon-tree-animate/icons/chart-2";
import CloudIcon from "icon-tree-animate/icons/cloud";
import CodeIcon from "icon-tree-animate/icons/code";
import CommandIcon from "icon-tree-animate/icons/command";
import ComponentIcon from "icon-tree-animate/icons/component";
import CpuIcon from "icon-tree-animate/icons/cpu";
import DangerIcon from "icon-tree-animate/icons/danger";
import DevicesIcon from "icon-tree-animate/icons/devices";
import DirectNotificationIcon from "icon-tree-animate/icons/direct-notification";
import DocumentCodeIcon from "icon-tree-animate/icons/document-code";
import DocumentTextIcon from "icon-tree-animate/icons/document-text";
import FlashIcon from "icon-tree-animate/icons/flash";
import Folder2Icon from "icon-tree-animate/icons/folder-2";
import KeyIcon from "icon-tree-animate/icons/key";
import KeySquareIcon from "icon-tree-animate/icons/key-square";
import Link2Icon from "icon-tree-animate/icons/link-2";
import LockIcon from "icon-tree-animate/icons/lock";
import MagicStarIcon from "icon-tree-animate/icons/magic-star";
import MessageCircleIcon from "icon-tree-animate/icons/message-circle";
import MessageIcon from "icon-tree-animate/icons/message";
import MonitorIcon from "icon-tree-animate/icons/monitor";
import NotificationBingIcon from "icon-tree-animate/icons/notification-bing";
import PeopleIcon from "icon-tree-animate/icons/people";
import ProfileCircleIcon from "icon-tree-animate/icons/profile-circle";
import RefreshCircleIcon from "icon-tree-animate/icons/refresh-circle";
import RefreshIcon from "icon-tree-animate/icons/refresh";
import ScanIcon from "icon-tree-animate/icons/scan";
import SettingIcon from "icon-tree-animate/icons/setting";
import ShieldTickIcon from "icon-tree-animate/icons/shield-tick";
import TickSquareIcon from "icon-tree-animate/icons/tick-square";
import TranslateIcon from "icon-tree-animate/icons/translate";
import WifiIcon from "icon-tree-animate/icons/wifi";

export type IconComponent = ComponentType<{
  size?: number | string;
  mode?: "static" | "loop" | "onClick" | "hover";
  className?: string;
  style?: CSSProperties;
}>;

/** A copy row (security item, stack card, lifecycle step) paired with its icon. */
export type IconRow = [title: string, desc: string, icon: IconComponent];

/**
 * Decorative IconTree icon: follows the surrounding text color (theme-safe),
 * plays once on pointer hover, and is inert under prefers-reduced-motion via
 * the .icon-anim rule in styles.css.
 */
export function FeatureIcon({ C, px = 34 }: { C: IconComponent; px?: number }) {
  return (
    <span
      aria-hidden
      className="icon-anim icontree-icon inline-flex shrink-0 text-foreground"
      style={{ width: px, height: px }}
    >
      <C size={px} mode="hover" />
    </span>
  );
}

export const Icons = {
  "folder-2": Folder2Icon,
  "direct-notification": DirectNotificationIcon,
  command: CommandIcon,
  "chart-2": Chart2Icon,
  scan: ScanIcon,
  translate: TranslateIcon,
  key: KeyIcon,
  cpu: CpuIcon,
  flash: FlashIcon,
  "box-time": BoxTimeIcon,
  "refresh-circle": RefreshCircleIcon,
  "box-remove": BoxRemoveIcon,
  setting: SettingIcon,
  monitor: MonitorIcon,
  code: CodeIcon,
  "magic-star": MagicStarIcon,
  danger: DangerIcon,
  "arrow-swap-horizontal": ArrowSwapIcon,
  "message-circle": MessageCircleIcon,
  component: ComponentIcon,
  activity: ActivityIcon,
  book: BookIcon,
  "box-tick": BoxTickIcon,
  "bucket-square": BucketSquareIcon,
  cloud: CloudIcon,
  devices: DevicesIcon,
  "document-code": DocumentCodeIcon,
  "document-text": DocumentTextIcon,
  "key-square": KeySquareIcon,
  "link-2": Link2Icon,
  lock: LockIcon,
  message: MessageIcon,
  "notification-bing": NotificationBingIcon,
  people: PeopleIcon,
  "profile-circle": ProfileCircleIcon,
  refresh: RefreshIcon,
  "shield-tick": ShieldTickIcon,
  "tick-square": TickSquareIcon,
  wifi: WifiIcon,
} as const;
