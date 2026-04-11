import { cn } from "@/lib/utils";

interface RichTextDisplayProps {
  html: string;
  className?: string;
  inlineParagraphs?: boolean;
}

// Removes unsafe markup and normalizes editor paragraph wrappers for display-only UI.
const normalizeRichTextHtml = (html: string, inlineParagraphs: boolean) => {
  const safeHtml = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");

  if (!inlineParagraphs) {
    return safeHtml;
  }

  return safeHtml
    .replace(/<\/p>\s*<p>/gi, "<br />")
    .replace(/^<p>/i, "")
    .replace(/<\/p>$/i, "");
};

// Displays saved rich text HTML without exposing editor wrapper tags in the UI.
export const RichTextDisplay = ({
  html,
  className,
  inlineParagraphs = false,
}: RichTextDisplayProps) => {
  const Component = inlineParagraphs ? "span" : "div";

  return (
    <Component
      className={cn(
        "min-w-0 break-words [&_*]:break-words [&_a]:text-primary [&_a]:underline [&_ol]:my-1 [&_ol]:pl-5 [&_p]:m-0 [&_ul]:my-1 [&_ul]:pl-5",
        className,
      )}
      dangerouslySetInnerHTML={{
        __html: normalizeRichTextHtml(html, inlineParagraphs),
      }}
    />
  );
};
