import { ABOUT_COPY, type AboutContent } from "@/lib/placeholder/about";
import { AboutCTA } from "../AboutCTA/AboutCTA";
import { AboutHero } from "../AboutHero/AboutHero";
import { AboutReveal } from "../AboutReveal/AboutReveal";
import { AboutStory } from "../AboutStory/AboutStory";
import { ClientsList } from "../ClientsList/ClientsList";
import { FunFacts } from "../FunFacts/FunFacts";
import { JourneyTimeline } from "../JourneyTimeline/JourneyTimeline";
import { MediumsShowcase } from "../MediumsShowcase/MediumsShowcase";
import { ProcessSteps } from "../ProcessSteps/ProcessSteps";
import { SocialLinks } from "../SocialLinks/SocialLinks";
import { ToolsSkills } from "../ToolsSkills/ToolsSkills";

// Editorial layout: huge type, numbered chapters, index-style lists, lots of
// white space and a dark CTA panel.
export function AboutEditorial({ content }: { content: AboutContent }) {
  const props = { layout: "editorial", content, copy: ABOUT_COPY.editorial } as const;

  return (
    <AboutReveal layout="editorial">
      <AboutHero layout="editorial" content={content} />
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
  );
}
