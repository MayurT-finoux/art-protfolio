import { Footer } from "@/components/site/Footer/Footer";
import { MainNav } from "@/components/site/MainNav/MainNav";
import { PlayerDock } from "@/components/site/PlayerDock/PlayerDock";
import { getFooterContent, getNavContent } from "@/lib/content/queries";
import { footerSocial, navLinks } from "@/lib/content/types";
import { footerLinks, music } from "@/lib/placeholder/home";

// Public site shell. The MusicPlayer lives here (not the root layout) so it
// keeps playing across public pages but never appears in /admin.
// Footer text + social links come from the admin ("Footer & social"), nav links from "Navigation".
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [footer, nav] = await Promise.all([getFooterContent(), getNavContent()]);
  const social = footerSocial(footer);

  return (
    <>
      <MainNav
        items={navLinks(nav)}
        wordmark={nav.menuWordmark || footer.wordmark}
        email={footer.email}
        instagram={social.find((s) => s.label === "Instagram")}
        track={music.track}
      />
      <main>{children}</main>
      <Footer
        wordmark={footer.wordmark}
        sayHiLabel={footer.sayHiLabel}
        location={footer.location}
        email={footer.email}
        copyright={footer.copyright}
        pageLinks={footerLinks}
        social={social}
      />
      <PlayerDock track={music.track} />
    </>
  );
}
