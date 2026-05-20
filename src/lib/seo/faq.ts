import type { Post } from "@/types/content";

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function extractFaqFromHtml(html?: string | null) {
  if (!html) {
    return [] as Post["faq"];
  }

  const yoastFaq = [
    ...html.matchAll(
      /<div class="schema-faq-section"[\s\S]*?<strong class="schema-faq-question">([\s\S]*?)<\/strong>[\s\S]*?<p class="schema-faq-answer">([\s\S]*?)<\/p>[\s\S]*?<\/div>/gi,
    ),
  ].map((match) => ({
    question: stripHtml(match[1]),
    answer: stripHtml(match[2]),
  }));

  if (yoastFaq.length) {
    return yoastFaq;
  }

  const rankMathFaq = [
    ...html.matchAll(
      /<div class="rank-math-list-item"[\s\S]*?<h3 class="rank-math-question">([\s\S]*?)<\/h3>[\s\S]*?<div class="rank-math-answer">([\s\S]*?)<\/div>[\s\S]*?<\/div>/gi,
    ),
  ].map((match) => ({
    question: stripHtml(match[1]),
    answer: stripHtml(match[2]),
  }));

  if (rankMathFaq.length) {
    return rankMathFaq;
  }

  const faqSectionMatch = html.match(
    /<h2[^>]*>\s*(?:faq|perguntas frequentes)\s*<\/h2>([\s\S]*?)(?=<h2[^>]*>|$)/i,
  );

  if (!faqSectionMatch?.[1]) {
    return [];
  }

  const faqSection = faqSectionMatch[1];

  return [...faqSection.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>|$)/gi)]
    .map((match) => {
      const question = stripHtml(match[1]);
      const answer = stripHtml(
        (match[2] ?? "")
          .replace(/<ul[\s\S]*?<\/ul>/gi, " ")
          .replace(/<ol[\s\S]*?<\/ol>/gi, " ")
          .replace(/<blockquote[\s\S]*?<\/blockquote>/gi, " ")
          .replace(/<figure[\s\S]*?<\/figure>/gi, " "),
      );

      if (!question || !answer) {
        return null;
      }

      return { question, answer };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}
