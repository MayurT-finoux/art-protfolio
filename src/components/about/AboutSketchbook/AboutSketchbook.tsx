import { ABOUT_COPY, type AboutContent } from "@/lib/placeholder/about";
import { AboutCTA } from "../AboutCTA/AboutCTA";
import { AboutHero } from "../AboutHero/AboutHero";
import { AboutReveal } from "../AboutReveal/AboutReveal";
import { AboutStory } from "../AboutStory/AboutStory";
import { ClientsList } from "../ClientsList/ClientsList";
import { FunFacts } from "../FunFacts/FunFacts";
import { GuideCharacter } from "../GuideCharacter/GuideCharacter";
import { JourneyTimeline } from "../JourneyTimeline/JourneyTimeline";
import { MediumsShowcase } from "../MediumsShowcase/MediumsShowcase";
import { ProcessSteps } from "../ProcessSteps/ProcessSteps";
import { SocialLinks } from "../SocialLinks/SocialLinks";
import { ToolsSkills } from "../ToolsSkills/ToolsSkills";
import styles from "./AboutSketchbook.module.css";

// Sketchbook layout: ruled paper, taped polaroids, stickers, doodles that draw
// themselves in, and the GuideCharacter in the corner.
export function AboutSketchbook({ content }: { content: AboutContent }) {
  const props = { layout: "sketchbook", content, copy: ABOUT_COPY.sketchbook } as const;

  return (
    <>
      <AboutReveal layout="sketchbook" className={styles.paper}>
        <AboutHero layout="sketchbook" content={content} />
        <AboutStory {...props} />
        <MediumsShowcase {...props} />
        <ProcessSteps {...props} />
        <ToolsSkills {...props} />
        <JourneyTimeline {...props} />
        <ClientsList {...props} />
        <FunFacts {...props} />
        <SocialLinks {...props} />
        <AboutCTA {...props} />
      </AboutReveal>
      <GuideCharacter image={content.guideImage} lines={content.guideLines} />
    </>
  );
}
