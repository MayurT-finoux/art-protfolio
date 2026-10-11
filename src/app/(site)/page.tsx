import { AboutSection } from "@/components/home/AboutSection/AboutSection";
import { FreshWork } from "@/components/home/FreshWork/FreshWork";
import { HeroAnimation } from "@/components/home/HeroAnimation/HeroAnimation";
import { HeroIntro } from "@/components/home/HeroIntro/HeroIntro";
import { HeroScroll } from "@/components/home/HeroScroll/HeroScroll";
import { InfoCards } from "@/components/home/InfoCards/InfoCards";
import { SelectedWork } from "@/components/home/SelectedWork/SelectedWork";
import { getHomePageData } from "@/lib/content/home";
import { freshWork, hero, infoCards, selectedWork } from "@/lib/placeholder/home";
import styles from "./page.module.css";

export default async function HomePage() {
  const { content: c, selected, fresh, aboutButtons } = await getHomePageData();

  return (
    <div data-home className={styles.home}>
      <HeroAnimation video={c.heroVideo} still={c.heroStill} />
      <HeroIntro
        label={c.heroLabel}
        heading={c.heroHeading}
        intro={c.heroIntro}
        scrollHint={hero.scrollHint}
        scrollHintMobile={hero.scrollHintMobile}
      />
      <HeroScroll />

      <div className={styles.content}>
        {/* The hero shows through this first screen. */}
        <div className={styles.spacer} />
        <SelectedWork
          label={c.selectedLabel}
          labelMobile={selectedWork.labelMobile}
          heading={c.selectedHeading}
          button={{ label: c.selectedButton, href: selectedWork.button.href }}
          items={selected}
        />
        <FreshWork
          label={c.freshLabel}
          heading={c.freshHeading}
          followButton={c.followButton}
          followHref={freshWork.followHref}
          items={fresh}
        />
        <AboutSection
          video={c.aboutVideo}
          still={c.aboutStill}
          windowLabel={c.aboutWindowLabel}
          label={c.aboutLabel}
          paragraphs={[c.aboutParagraph1, c.aboutParagraph2]}
          buttons={aboutButtons}
        />
        <InfoCards cards={infoCards} />
      </div>
    </div>
  );
}
