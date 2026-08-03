import { getContainerRenderer as mdxContainerRenderer } from '@astrojs/mdx'
import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { getImage } from 'astro:assets'
import { loadRenderers } from 'astro:container'
import { getCollection, render } from 'astro:content'
import { toFeedHtml } from '../utils/feedContent'
import { BLOG_DESCRIPTION, BLOG_TITLE, RSS_FEED_PATH, RSS_STYLESHEET_PATH } from '../utils/site'

export async function GET(context: APIContext) {
  const site = context.site!
  const posts = await getCollection('blog', ({ data }) => !data.draft)

  posts.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())

  const lastBuildDate = posts[0]?.data.publishDate ?? new Date(0)
  const feedUrl = new URL(RSS_FEED_PATH, site).toString()

  const container = await AstroContainer.create({ renderers: await loadRenderers([mdxContainerRenderer()]) })

  const items = []

  for (const post of posts) {
    const postUrl = new URL(`/blog/${post.id}/`, site).toString()
    const { Content } = await render(post)
    const body = toFeedHtml(await container.renderToString(Content), { postUrl })
    // Same dimensions the post page requests, so both share one emitted asset.
    const cover =
      post.data.featuredImage && (await getImage({ src: post.data.featuredImage, width: 1200, height: 630 }))

    items.push({
      title: post.data.title,
      pubDate: post.data.publishDate,
      link: postUrl,
      categories: post.data.tags,
      description: post.data.description,
      content: `${body}<hr/><p><em>Originally published at <a href="${postUrl}">nop33.com</a>.</em></p>`,
      // The optimized asset is emitted after the pages are rendered, so its byte size is not
      // knowable here. 0 is the conventional "unknown" length, and feed readers ignore it.
      enclosure: cover && {
        url: new URL(cover.src, site).toString(),
        length: 0,
        type: `image/${cover.options.format}`,
      },
      // RSS 2.0 requires <author> to be an email address, so credit goes through Dublin Core.
      customData: `<dc:creator><![CDATA[${post.data.author}]]></dc:creator>`,
    })
  }

  return rss({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    site,
    stylesheet: RSS_STYLESHEET_PATH,
    xmlns: { atom: 'http://www.w3.org/2005/Atom', dc: 'http://purl.org/dc/elements/1.1/' },
    items,
    customData: [
      `<language>en-us</language>`,
      `<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`,
      `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
    ].join(''),
  })
}
