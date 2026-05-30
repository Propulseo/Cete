import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Rend le corps Markdown d'un article avec un habillage éditorial cohérent avec
 * la charte CETé (titres Merriweather, texte #4A6580, accents #E8630A).
 * Utilisable en RSC (vitrine) comme en client (aperçu admin).
 */
const components: Components = {
  h1: ({ children }) => (
    <h2 className="font-display text-2xl md:text-3xl text-[#1A2940] leading-snug mt-12 mb-5 first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="flex items-center gap-3 font-display text-xl md:text-2xl text-[#1A2940] leading-snug mt-12 mb-5 first:mt-0">
      <span className="inline-block h-6 w-1 rounded-full bg-[#4DA6D9]" />
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-lg md:text-xl text-[#1A2940] mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-[#4A6580] leading-relaxed text-lg mb-6">{children}</p>
  ),
  a: ({ href, children }) => {
    const external = !!href && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="font-medium text-[#1A7AB5] underline decoration-[#4DA6D9]/40 underline-offset-2 transition-colors hover:text-[#E8630A]"
      >
        {children}
      </a>
    );
  },
  strong: ({ children }) => (
    <strong className="font-semibold text-[#1A2940]">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-[#4A6580]">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-6 list-disc space-y-2.5 pl-6 marker:text-[#E8630A]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 list-decimal space-y-2.5 pl-6 marker:font-semibold marker:text-[#4DA6D9]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1.5 text-lg leading-relaxed text-[#4A6580]">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 rounded-r-2xl border-l-4 border-[#4DA6D9] bg-[#F4F9FD] py-4 pl-6 pr-5 text-lg italic text-[#4A6580]">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-t border-[#DAEEF8]" />,
  img: ({ src, alt }) => (
    <figure className="my-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={typeof src === "string" ? src : ""}
        alt={alt ?? ""}
        loading="lazy"
        className="w-full rounded-2xl ring-1 ring-[#DAEEF8]/60 shadow-lg shadow-[#1A2940]/5"
      />
      {alt && (
        <figcaption className="mt-3 text-center text-sm text-[#8AA5BE]">{alt}</figcaption>
      )}
    </figure>
  ),
  code: ({ className, children }) => {
    const block = (className ?? "").includes("language-");
    if (block) {
      return (
        <code className="block overflow-x-auto rounded-xl bg-[#1A2940] p-4 font-mono text-sm leading-relaxed text-[#DAEEF8]">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-[#F4F9FD] px-1.5 py-0.5 font-mono text-[0.9em] text-[#0D5A8A]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-6">{children}</pre>,
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-xl ring-1 ring-[#DAEEF8]">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[#F4F9FD]">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-[#DAEEF8] px-4 py-3 font-semibold text-[#1A2940]">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-[#DAEEF8]/60 px-4 py-3 text-[#4A6580]">{children}</td>
  ),
};

export function ArticleBody({ content }: { content: string }) {
  return (
    <div className="article-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
