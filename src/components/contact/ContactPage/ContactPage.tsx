import type { ContactContent } from "@/lib/placeholder/contact";
import { ContactForm } from "../ContactForm/ContactForm";
import { ContactIntro } from "../ContactIntro/ContactIntro";
import { DirectLines } from "../DirectLines/DirectLines";
import { GoodToKnow } from "../GoodToKnow/GoodToKnow";
import styles from "./ContactPage.module.css";

type Props = { content: ContactContent };

export function ContactPage({ content }: Props) {
  return (
    <div data-component="ContactPage" className={styles.page}>
      <ContactIntro
        label={content.label}
        heading={content.heading}
        intro={content.intro}
        availability={content.availability}
        availabilityLabel={content.availabilityLabel}
      />
      <section className={styles.main}>
        <ContactForm
          topics={content.topics}
          budgetOptions={content.budgetOptions}
          timingOptions={content.timingOptions}
        />
        <DirectLines
          email={content.email}
          instagramHandle={content.instagramHandle}
          instagramHref={content.instagramHref}
          note={content.replyNote}
        />
      </section>
      <GoodToKnow facts={content.facts} />
    </div>
  );
}
