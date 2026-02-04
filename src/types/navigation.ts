export interface NavItem {
  label: string;
  href: string;
}

export interface Navigation {
  mainNav: NavItem[];
  footerNav: NavItem[];
  ctaButtons: NavItem[];
}
