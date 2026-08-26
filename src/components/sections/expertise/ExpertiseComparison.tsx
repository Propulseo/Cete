"use client";

import { useTranslations } from "next-intl";

const axisKeys = ["axis0", "axis1", "axis2", "axis3"];

const gapKeys = [
  { number: "01", key: "gap0" },
  { number: "02", key: "gap1" },
  { number: "03", key: "gap2" },
];

export function ExpertiseComparison() {
  const t = useTranslations("expertise.comparison");

  return (
    <section className="section-pad bg-[#F4F9FD]">
      <div className="container-page">
        <div className="mx-auto mb-11 max-w-[700px] text-center">
          <p className="type-kicker mb-4 inline-block rounded-full bg-[#4DA6D9]/14 px-4 py-2 text-[#1A2940]">
            {t("badge")}
          </p>
          <h2 className="type-h2-section text-[#1A2940]">
            {t("heading")} <span className="text-[#8AA5BE]">vs</span> {t("headingTalents")}
          </h2>
        </div>

        <div className="shadow-cete-lg mb-[clamp(48px,6vw,72px)] overflow-x-auto rounded-[20px] border border-subtle bg-white">
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr className="bg-[#1A2940]">
                <th className="rounded-tl-[20px] px-[22px] py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#87C4E8]" scope="col">
                  {t("columnTheme")}
                </th>
                <th className="px-[22px] py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-red-300" scope="col">
                  {t("columnVulnerables")}
                </th>
                <th className="rounded-tr-[20px] px-[22px] py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-green-300" scope="col">
                  {t("columnTalents")}
                </th>
              </tr>
            </thead>
            <tbody>
              {axisKeys.map((key, index) => (
                <tr key={key} className={`${index % 2 === 1 ? "bg-[#FBFDFF]" : "bg-white"} border-b border-[#DAEEF8] last:border-b-0`}>
                  <th className="px-[22px] py-[18px] text-left align-top text-[14.5px] font-semibold text-[#1A2940]" scope="row">
                    {t(`${key}.theme`)}
                  </th>
                  <td className="px-[22px] py-[18px] align-top text-sm leading-[1.6] text-[#4A6580]">
                    {t(`${key}.vulnerable`)}
                  </td>
                  <td className="px-[22px] py-[18px] align-top text-sm leading-[1.6] text-[#4A6580]">
                    {t(`${key}.talent`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mx-auto mb-10 max-w-[640px] text-center">
          <p className="type-kicker mb-4 inline-block rounded-full bg-[#E8630A]/10 px-4 py-2 text-[#B84D08]">
            {t("gapBadge")}
          </p>
          <h2 className="font-display text-[clamp(26px,3.2vw,40px)] font-black uppercase leading-[1.1] text-[#1A2940]">
            {t("gapHeading")} <span className="text-[#E8630A]">{t("gapHeadingHighlight")}</span>
          </h2>
        </div>

        <div className="grid gap-[22px] md:grid-cols-3">
          {gapKeys.map((gap) => (
            <article
              key={gap.number}
              className="shadow-cete-md relative rounded-[18px] border border-subtle bg-white px-[26px] py-8"
            >
              <span className="absolute right-[22px] top-5 font-display text-[40px] font-black leading-none text-[#E8630A]/18">
                {gap.number}
              </span>
              <h3 className="type-h3-card mb-3 max-w-[74%] text-[#1A2940]">
                {t(`${gap.key}.title`)}
              </h3>
              <p className="text-[14.5px] leading-[1.7] text-[#4A6580]">
                {t(`${gap.key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
