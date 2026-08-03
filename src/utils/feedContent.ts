import sanitizeHtml from 'sanitize-html'

// `AnimatedFigure.astro` marks its wrapper with `data-anim` and closes with the caption.
// The stages are pure CSS, so outside the site they are markup that means nothing.
const ANIMATED_FIGURE =
  /<figure\b[^>]*\bdata-anim=[^>]*>[\s\S]*?<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>\s*<\/figure>/g

// Inline SVG diagrams flatten into a wall of orphan labels once the shapes are stripped.
const INLINE_SVG = /<svg\b[^>]*>([\s\S]*?)<\/svg>/g
const SVG_TITLE = /<title>([\s\S]*?)<\/title>/

// Shiki records the language on the <pre>, but `language-*` on the <code> is what
// HTML-to-Markdown converters (dev.to's feed importer among them) read to fence a block.
const CODE_BLOCK_OPENING = /<pre\b([^>]*)>\s*<code>/g
const SHIKI_LANGUAGE = /\bdata-language="([^"]*)"/

const INLINE_ONLY = {
  allowedTags: ['a', 'b', 'br', 'code', 'em', 'i', 'strong'],
  allowedAttributes: { a: ['href'] },
}

const absoluteUrl = (value: string | undefined, base: string) => {
  if (!value) return undefined
  try {
    return new URL(value, base).toString()
  } catch {
    return undefined
  }
}

const linkBack = (caption: string, label: string, postUrl: string) => {
  const link = `<a href="${postUrl}">${label} on nop33.com</a>`
  return caption ? `<p><em>${caption}</em> ${link}</p>` : `<p>${link}</p>`
}

const replaceAnimatedFigures = (html: string, postUrl: string) =>
  html.replace(ANIMATED_FIGURE, (_figure, caption: string) =>
    linkBack(sanitizeHtml(caption, INLINE_ONLY).trim(), 'View the animation', postUrl),
  )

const replaceInlineSvgs = (html: string, postUrl: string) =>
  html.replace(INLINE_SVG, (_svg, body: string) => {
    const title = body.match(SVG_TITLE)?.[1] ?? ''
    return linkBack(sanitizeHtml(title, INLINE_ONLY).trim(), 'View the diagram', postUrl)
  })

const labelCodeBlocks = (html: string) =>
  html.replace(CODE_BLOCK_OPENING, (match, attributes: string) => {
    const language = attributes.match(SHIKI_LANGUAGE)?.[1]
    return language ? `<pre><code class="language-${language}">` : match
  })

export const toFeedHtml = (html: string, { postUrl }: { postUrl: string }) => {
  const prepared = labelCodeBlocks(replaceInlineSvgs(replaceAnimatedFigures(html, postUrl), postUrl))

  return sanitizeHtml(prepared, {
    // Shiki wraps every token in a <span>; dropping them leaves the code text and its newlines.
    allowedTags: [...sanitizeHtml.defaults.allowedTags.filter((tag) => tag !== 'span'), 'img'],
    // Anything left here would otherwise have its contents spilled into the feed as loose text.
    nonTextTags: ['script', 'style', 'noscript', 'textarea', 'option', 'svg'],
    allowedAttributes: {
      a: ['href', 'title'],
      code: ['class'],
      img: ['src', 'alt', 'width', 'height'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, href: absoluteUrl(attribs.href, postUrl) ?? attribs.href },
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, src: absoluteUrl(attribs.src, postUrl) ?? attribs.src },
      }),
    },
  })
}
