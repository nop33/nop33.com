import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'
import { BLOG_DESCRIPTION, BLOG_TITLE, RSS_FEED_PATH } from '../utils/site'

export async function GET(context: APIContext) {
  const site = context.site!
  const posts = await getCollection('blog', ({ data }) => !data.draft)

  posts.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())

  const lastBuildDate = posts[0]?.data.publishDate ?? new Date(0)
  const feedUrl = new URL(RSS_FEED_PATH, site).toString()

  return rss({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    site,
    xmlns: { atom: 'http://www.w3.org/2005/Atom', dc: 'http://purl.org/dc/elements/1.1/' },
    items: posts.map((post) => {
      const postUrl = new URL(`/blog/${post.id}/`, site).toString()

      return {
        title: post.data.title,
        pubDate: post.data.publishDate,
        link: postUrl,
        categories: post.data.tags,
        description: `<p>${post.data.description}</p><p><a href="${postUrl}">Read the full article on nop33.com</a></p>`,
        // RSS 2.0 requires <author> to be an email address, so credit goes through Dublin Core.
        customData: `<dc:creator><![CDATA[${post.data.author}]]></dc:creator>`,
      }
    }),
    customData: [
      `<language>en-us</language>`,
      `<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`,
      `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
    ].join(''),
  })
}
