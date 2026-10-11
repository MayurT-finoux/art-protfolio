import { Footer } from "@/components/site/Footer/Footer";
import { MainNav } from "@/components/site/MainNav/MainNav";
import { PlayerDock } from "@/components/site/PlayerDock/PlayerDock";
import { footerLinks, music, nav, site, social } from "@/lib/placeholder/home";

// Public site shell. The MusicPlayer lives here (not the root layout) so it
// keeps playing across public pages but never appears in /admin.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <MainNav
        items={nav}
        wordmark={site.wordmark}
        email={site.email}
        instagram={social[0]}
        track={music.track}
      />
      <main>{children}</main>
      <Footer
        wordmark={site.wordmark}
        sayHiLabel={site.sayHiLabel}
        location={site.location}
        email={site.email}
        copyright={site.copyright}
        pageLinks={footerLinks}
        social={social}
      />
      <PlayerDock track={music.track} />
    </>
  );
}
