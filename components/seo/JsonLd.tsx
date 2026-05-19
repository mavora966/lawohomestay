export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  // Escape </script> sequences so injected JSON can't break out of the script tag
  const safe = JSON.stringify(data).replace(/<\/script>/gi, "<\\/script>");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
