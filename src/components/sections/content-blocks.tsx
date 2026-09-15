import Link from "next/link";
import type { ContentBlock } from "@/types/content-page";

/**
 * Rendu d'un bloc de contenu. Un `kind` = un rendu, sans exception :
 * c'est ce qui permet à l'admin de proposer un formulaire par type de bloc
 * sans avoir à deviner ce que la page va en faire.
 */
export function ContentBlockView({ block }: { block: ContentBlock }) {
  switch (block.kind) {
    case "titre":
      return (
        <h2 id={headingId(block.text)} className="content-h2">
          {block.text}
        </h2>
      );

    case "paragraphe":
      return <p className="content-p">{block.text}</p>;

    case "liste":
      return (
        <ul className="content-list">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );

    case "tableau":
      return (
        <div className="content-table-wrap">
          <table className="content-table">
            {block.caption && <caption>{block.caption}</caption>}
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, index) =>
                    // La première colonne nomme la ligne : c'est un en-tête de
                    // ligne, pas une donnée. Sans ça, un lecteur d'écran lit
                    // « 4,90 € » sans jamais dire de quelle livraison il parle.
                    index === 0 ? (
                      <th key={cell} scope="row" className="font-normal">
                        {cell}
                      </th>
                    ) : (
                      <td key={cell}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "faq":
      return (
        <div className="content-faq">
          {block.items.map((item) => (
            <details key={item.question} className="content-faq__item">
              <summary className="content-faq__question">
                {item.question}
              </summary>
              <p className="content-faq__answer">{item.answer}</p>
            </details>
          ))}
        </div>
      );

    case "cartes":
      return (
        <div className="content-cards">
          {block.items.map((item) => (
            <div key={item.title} className="content-card">
              <h3 className="content-card__title">{item.title}</h3>
              <p className="content-card__text">{item.text}</p>
            </div>
          ))}
        </div>
      );

    case "etapes":
      return (
        <ol className="content-steps">
          {block.items.map((item) => (
            <li key={item.title} className="content-step">
              <div>
                <h3 className="content-step__title">{item.title}</h3>
                <p className="content-step__text">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "note":
      return <p className="content-note">{block.text}</p>;

    case "appel":
      return (
        <div>
          <Link href={block.href} className="link-cta-block mt-0">
            {block.label}
          </Link>
        </div>
      );
  }
}

/**
 * Ancre d'un intertitre. Elle se calcule du texte plutôt que d'être saisie :
 * un identifiant à renseigner à la main est un identifiant qui finit en
 * double, et les liens du sommaire cessent silencieusement de fonctionner.
 */
export function headingId(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
