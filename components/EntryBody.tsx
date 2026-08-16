import { splitIntoSentences, groupIntoParagraphs } from "@/lib/text";

export function EntryBody({ text }: { text: string }) {
  const sentences = splitIntoSentences(text);

  if (sentences.length <= 2) {
    return <p className="text-[15px] leading-relaxed text-body">{text}</p>;
  }

  const verdict = sentences[sentences.length - 1];
  const bodySentences = sentences.slice(0, -1);
  const paragraphs = groupIntoParagraphs(bodySentences, 2);

  return (
    <div className="space-y-3">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-[15px] leading-relaxed text-body">
          {p}
        </p>
      ))}
      <p className="rounded-md border-l-2 border-accent/40 bg-accent/[0.05] py-2 pl-3 text-[15px] leading-relaxed text-foreground">
        {verdict}
      </p>
    </div>
  );
}
