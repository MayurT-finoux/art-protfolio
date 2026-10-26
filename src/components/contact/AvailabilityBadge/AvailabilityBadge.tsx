import type { Availability } from "@/lib/placeholder/contact";
import styles from "./AvailabilityBadge.module.css";

type Props = { status: Availability; label: string };

export function AvailabilityBadge({ status, label }: Props) {
  return (
    <span data-component="AvailabilityBadge" data-status={status} className={styles.badge}>
      <span className={styles.dot} />
      {label}
    </span>
  );
}
