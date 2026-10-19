import { Footer } from "@/components/site/Footer/Footer";
import { MainNav } from "@/components/site/MainNav/MainNav";
import { PlayerDock } from "@/components/site/PlayerDock/PlayerDock";
import { getFooterContent } from "@/lib/content/queries";
import { footerSocial } from "@/lib/content/types";
import { footerLinks, music, nav } from "@/lib/placeholder/home";

// Public site shell. The MusicPlayer lives here (not the root layout) so it
// keeps playing across public pages but never appears in /admin.
// Footer text + social links come from the admin ("Footer & social").
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const footer = await getFooterContent();
  const social = footerSocial(footer);

  return (
    <>
      <MainNav
        items={nav}
        wordmark={footer.wordmark}
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
