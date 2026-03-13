const EMPTY_PARAGRAPH_REGEX = /<p(\s[^>]*)?>(?:\s|&nbsp;|&#160;|<br\s*\/?>)*<\/p>/gi;

const appendClassAttribute = (attributes = "", className: string) => {
  if (/class\s*=/.test(attributes)) {
    return attributes.replace(
      /class=(['"])(.*?)\1/i,
      (_match, quote, currentClasses) =>
        `class=${quote}${currentClasses} ${className}${quote}`
    );
  }

  return `${attributes} class="${className}"`;
};

export const preserveRichTextSpacing = (html?: string | null): string => {
  if (!html) {
    return "";
  }

  return html.replace(EMPTY_PARAGRAPH_REGEX, (_match, attributes = "") => {
    const nextAttributes = appendClassAttribute(attributes, "editor-spacer");
    return `<p${nextAttributes}><br /></p>`;
  });
};