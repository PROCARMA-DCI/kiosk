import DOMPurify from "dompurify";

export default function SafeHTML({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html);
  return (
    <div
      className="prose prose-neutral max-w-none"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
