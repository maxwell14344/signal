export function splitIntoSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]+(\s+|$)/g);
  return matches ? matches.map((s) => s.trim()).filter(Boolean) : [text];
}

export function groupIntoParagraphs(sentences: string[], perParagraph = 2): string[] {
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += perParagraph) {
    paragraphs.push(sentences.slice(i, i + perParagraph).join(" "));
  }
  return paragraphs;
}
