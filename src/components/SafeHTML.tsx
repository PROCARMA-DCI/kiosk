import DOMPurify from "dompurify";

export default function SafeHTML({ html }: { html: string }) {
  const cleanHtml = DOMPurify.sanitize(html, {
    // FORBID_TAGS: ["html", "*", "body", "container", "header"],
  });

  return (
    <div className="relative overflow-hidden rounded-md border p-4">
      <div
        className="[&_*]:!max-w-full [&_*]:!text-inherit [&_*]:!m-0"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </div>
  );
}
