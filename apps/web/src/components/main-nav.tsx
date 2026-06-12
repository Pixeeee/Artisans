import Link from "next/link";
import { AccountIdentityBadge } from "./account-identity-badge";
import { BrandCube } from "./brand-cube";
import { SmartArtsLink } from "./smart-nav-link";

const items = [
  { href: "/", label: "home" },
  { href: "/arts", label: "arts" },
  { href: "/earn", label: "earn" },
  { href: "/about", label: "about" },
] as const;

const [home, arts, earn, about] = items;

export function MainNav() {
  return (
    <>
      <nav className="fixed left-1/2 top-3 z-30 w-[min(92vw,430px)] -translate-x-1/2 text-black md:top-5 md:w-[min(64vw,600px)]">
        <div className="nav-link-bar grid grid-cols-[1fr_1fr_62px_1fr_1fr] items-center gap-1 text-center text-[13px] font-extrabold leading-none tracking-[0.01em] md:grid-cols-[1fr_1fr_70px_1fr_1fr] md:text-[14px]">
          <Link className="nav-link" href={home.href}>
            {home.label}
          </Link>
          <SmartArtsLink className="nav-link">
            {arts.label}
          </SmartArtsLink>
          <Link aria-label="ArtisanS home" className="nav-center-icon" href="/">
            <BrandCube className="h-10 w-10 md:h-11 md:w-11" />
          </Link>
          <Link className="nav-link" href={earn.href}>
            {earn.label}
          </Link>
          <Link className="nav-link" href={about.href}>
            {about.label}
          </Link>
        </div>
      </nav>
      <AccountIdentityBadge />
    </>
  );
}
