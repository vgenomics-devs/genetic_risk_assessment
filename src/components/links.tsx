// links.ts
export interface NavLink {
    label: string;
    href: string;
}

export const mainLinks: NavLink[] = [
    { label: "Company", href: "#company" },
    { label: "Solutions", href: "#solutions" },
    { label: "Our Science", href: "#science" },
    { label: "Patients", href: "#patients" },
    { label: "Careers", href: "#careers" },
];

export const bottomLinks: NavLink[] = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of use", href: "#" },
];


