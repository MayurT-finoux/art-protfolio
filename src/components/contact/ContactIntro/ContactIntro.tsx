import type { Availability } from "@/lib/placeholder/contact";
import { AvailabilityBadge } from "../AvailabilityBadge/AvailabilityBadge";
import styles from "./ContactIntro.module.css";

type Props = {
  label: string;
  heading: string;
  intro: string;
  availability: Availability;
  availabilityLabel: string;
};

export function ContactIntro({ label, heading, intro, availability, availabilityLabel }: Props) {
  return (
    <section data-component="ContactIntro" className={styles.intro}>
      <div className={styles.titles}>
        <span className={styles.label}>{label}</span>
        <h1 className={styles.heading}>{heading}</h1>
      </div>
      <div className={styles.side}>
        <AvailabilityBadge status={availability} label={availabilityLabel} />
        <p className={styles.text}>{intro}</p>
      </div>
    </section>
  );
}
