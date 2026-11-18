import { Footer } from "@/components/site/Footer/Footer";
import { MainNav } from "@/components/site/MainNav/MainNav";
import { PlayerDock } from "@/components/site/PlayerDock/PlayerDock";
import { getFooterContent, getMusicContent, getNavContent } from "@/lib/content/queries";
import { footerSocial, navLinks, playerTrack } from "@/lib/content/types";
import { footerLinks } from "@/lib/placeholder/home";

// Public site shell. The MusicPlayer lives here (not the root layout) so it
// keeps playing across public pages but never appears in /admin.
// Footer text + social links come from the admin ("Footer & social"), nav links from "Navigation", the player from "Music" (hidden when off).
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [footer, nav, music] = await Promise.all([getFooterContent(), getNavContent(), getMusicContent()]);
  const track = playerTrack(music);
  const social = footerSocial(footer);

  return (
    <>
      <MainNav
        items={navLinks(nav)}
        wordmark={nav.menuWordmark || footer.wordmark}
        email={footer.email}
        instagram={social.find((s) => s.label === "Instagram")}
        track={track}
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
      {track && <PlayerDock track={track} />}
    </>
  );
}
