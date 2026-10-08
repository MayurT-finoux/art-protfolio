import { AboutSection } from "@/components/home/AboutSection/AboutSection";
import { FreshWork } from "@/components/home/FreshWork/FreshWork";
import { HeroAnimation } from "@/components/home/HeroAnimation/HeroAnimation";
import { HeroIntro } from "@/components/home/HeroIntro/HeroIntro";
import { HeroScroll } from "@/components/home/HeroScroll/HeroScroll";
import { InfoCards } from "@/components/home/InfoCards/InfoCards";
import { SelectedWork } from "@/components/home/SelectedWork/SelectedWork";
import { aboutSection, freshWork, hero, infoCards, selectedWork } from "@/lib/placeholder/home";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div data-home className={styles.home}>
      <HeroAnimation video={hero.video} still={hero.still} />
      <HeroIntro
        label={hero.label}
        heading={hero.heading}
        intro={hero.intro}
        scrollHint={hero.scrollHint}
        scrollHintMobile={hero.scrollHintMobile}
      />
      <HeroScroll />

      <div className={styles.content}>
        {/* The hero shows through this first screen. */}
        <div className={styles.spacer} />
        <SelectedWork {...selectedWork} />
        <FreshWork {...freshWork} />
        <AboutSection {...aboutSection} />
        <InfoCards cards={infoCards} />
      </div>
    </div>
  );
}
