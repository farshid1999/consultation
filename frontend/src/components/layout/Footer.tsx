"use client";

import {FiInstagram, FiLinkedin, FiMail, FiPhone, FiSmartphone} from "react-icons/fi";
import {navLinks} from "@/data/content";
import {useLang} from "@/components/providers/LanguageProvider";

export default function Footer() {
    const {t} = useLang();

    return (
        <footer className="relative bg-deep px-6 pb-10 pt-4 md:px-10 lg:px-16">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 border-t border-cream/10 pt-14 md:grid-cols-[1.2fr_1fr_1fr]">
                    <div>
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo.webp"
                                alt={t.common.logoAlt}
                                className="h-12 w-12 rounded-full object-cover ring-1 ring-gold/30"
                            />
                            <span className="text-h3 font-extrabold text-cream">{t.brand}</span>
                        </div>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/50">
                            {t.footer.about}
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="https://instagram.com/Serenity.Ambassadors"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t.footer.instagramLabel}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition-colors duration-300 hover:border-gold/50 hover:text-gold"
                            >
                                <FiInstagram aria-hidden="true"/>
                            </a>
                        </div>
                    </div>

                    <div>
                        <p className="text-caption font-semibold text-gold">{t.footer.quickLinksTitle}</p>
                        <ul className="mt-5 flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <li key={link.id}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-cream/55 transition-colors duration-300 hover:text-gold"
                                    >
                                        {t.footer.quickLinks[link.id as keyof typeof t.footer.quickLinks]}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-caption font-semibold text-gold">{t.footer.contactTitle}</p>
                        <ul className="mt-5 flex flex-col gap-3 text-sm text-cream/55">
                            <li>
                                <a
                                    href="tel:01142206332"
                                    className="flex items-center gap-2.5 transition-colors duration-300 hover:text-gold"
                                >
                                    <FiPhone className="text-gold" aria-hidden="true"/>
                                    <span>{t.footer.institutePhoneLabel}</span>
                                    <span dir="ltr">{t.footer.institutePhoneDisplay}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:09360086228"
                                    className="flex items-center gap-2.5 transition-colors duration-300 hover:text-gold"
                                >
                                    <FiSmartphone className="text-gold" aria-hidden="true"/>
                                    <span>{t.footer.supportLabel}</span>
                                    <span dir="ltr">{t.footer.supportDisplay}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://instagram.com/Serenity.Ambassadors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 transition-colors duration-300 hover:text-gold"
                                >
                                    <FiInstagram className="text-gold" aria-hidden="true"/>
                                    <span dir="ltr">Serenity.Ambassadors</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:Serenityambassadors@gmail.com"
                                    className="flex items-center gap-2.5 transition-colors duration-300 hover:text-gold"
                                >
                                    <FiMail className="text-gold" aria-hidden="true"/>
                                    <span dir="ltr">Serenityambassadors@gmail.com</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/40 md:flex-row">
                    <p>© {new Date().getFullYear()} {t.brand}. {t.footer.rights}</p>
                </div>
            </div>
        </footer>
    );
}
