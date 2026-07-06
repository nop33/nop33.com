import getReadingTime from 'reading-time'
import { toString } from 'mdast-util-to-string'

/**
 * Remark plugin that estimates reading time for each Markdown/MDX document
 * and exposes it on the page's frontmatter as `minutesRead` (e.g. "3 min read").
 * Read it back via the `remarkPluginFrontmatter` returned from `render()`.
 */
export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree)
    const readingTime = getReadingTime(textOnPage)
    data.astro.frontmatter.minutesRead = readingTime.text
  }
}
