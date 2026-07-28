<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
>
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/rss/channel">
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/svg+xml" href="/nop33-favicon.svg" />
        <title>
          <xsl:value-of select="title" /> &#8212; RSS feed
        </title>
        <style>
          @font-face {
            font-family: 'Atkinson Hyperlegible';
            font-style: normal;
            font-weight: 400;
            src: url('/fonts/AtkinsonHyperlegibleNext-Regular.woff2') format('woff2');
            font-display: swap;
          }

          @font-face {
            font-family: 'Atkinson Hyperlegible';
            font-style: normal;
            font-weight: 600;
            src: url('/fonts/AtkinsonHyperlegibleNext-SemiBold.woff2') format('woff2');
            font-display: swap;
          }

          @font-face {
            font-family: 'Atkinson Hyperlegible';
            font-style: normal;
            font-weight: 700;
            src: url('/fonts/AtkinsonHyperlegibleNext-Bold.woff2') format('woff2');
            font-display: swap;
          }

          :root {
            color-scheme: light;
            --background: oklch(1 0 0);
            --foreground: oklch(0.3 0.0100986 252.998);
            --muted: oklch(0.4 0.0100986 252.998);
            --link: oklch(0.6 0.268831 317.501);
            --link-hover: oklch(0.7 0.268831 317.501);
            --border: oklch(0.9 0.0100986 252.998);
            --surface: oklch(0.97 0.0100986 252.998);
          }

          @media (prefers-color-scheme: dark) {
            :root {
              color-scheme: dark;
              --background: oklch(0.15 0.0100986 252.998);
              --foreground: oklch(1 0 0);
              --muted: oklch(0.75 0.0100986 252.998);
              --link: oklch(0.9 0.140303 179.495);
              --link-hover: oklch(0.8 0.140303 179.495);
              --border: oklch(0.3 0.0100986 252.998);
              --surface: oklch(0.2 0.0100986 252.998);
            }
          }

          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background-color: var(--background);
            color: var(--foreground);
            font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
            font-size: 1.0625rem;
            line-height: 1.6;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }

          .container {
            margin-inline: auto;
            padding-inline: 1.5rem;
            padding-block: 3rem 4rem;
            max-inline-size: 44rem;
          }

          a {
            color: var(--link);
            text-decoration-thickness: 2px;
            text-underline-offset: 0.2em;
          }

          a:where(:hover, :focus-visible) {
            color: var(--link-hover);
          }

          :focus-visible {
            outline: 2px dashed currentColor;
            outline-offset: 2px;
          }

          .eyebrow {
            display: inline-flex;
            gap: 0.5rem;
            align-items: center;
            margin-block-end: 0.75rem;
            border: 1px solid var(--border);
            border-radius: 999px;
            padding: 0.25rem 0.75rem;
            color: var(--muted);
            font-size: 0.8125rem;
            letter-spacing: 0.04em;
            text-transform: uppercase;
          }

          h1 {
            margin: 0;
            font-size: clamp(1.9rem, 1.4rem + 2vw, 2.75rem);
            font-weight: 700;
            line-height: 1.15;
            text-wrap: balance;
          }

          .tagline {
            margin-block: 0.75rem 0;
            color: var(--muted);
            font-size: 1.125rem;
            text-wrap: pretty;
          }

          .callout {
            margin-block: 2.5rem;
            border: 1px solid var(--border);
            border-radius: 0.75rem;
            background-color: var(--surface);
            padding: 1.5rem;
          }

          .callout h2 {
            margin: 0 0 0.5rem;
            font-size: 1.125rem;
            font-weight: 600;
          }

          .callout p {
            margin: 0 0 1rem;
            text-wrap: pretty;
          }

          .callout p:last-child {
            margin-block-end: 0;
          }

          .feed-url {
            display: block;
            margin-block-end: 1rem;
            border: 1px solid var(--border);
            border-radius: 0.5rem;
            background-color: var(--background);
            padding: 0.75rem 1rem;
            overflow-wrap: anywhere;
            color: var(--foreground);
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 0.9375rem;
            user-select: all;
          }

          h2.section-heading {
            margin-block: 3rem 0;
            font-size: 1.375rem;
            font-weight: 600;
          }

          ul.items {
            margin: 0;
            padding: 0;
            list-style: none;
          }

          ul.items > li {
            border-block-start: 1px solid var(--border);
            padding-block: 1.75rem;
          }

          h3.item-title {
            margin: 0.25rem 0 0.5rem;
            font-size: 1.3125rem;
            font-weight: 700;
            line-height: 1.3;
            text-wrap: balance;
          }

          h3.item-title a {
            color: inherit;
            text-decoration: none;
          }

          h3.item-title a:where(:hover, :focus-visible) {
            color: inherit;
            text-decoration: underline;
          }

          .meta {
            color: var(--muted);
            font-size: 0.875rem;
          }

          .summary {
            margin: 0;
            text-wrap: pretty;
          }

          .site-link {
            margin-block-start: 3rem;
            border-block-start: 1px solid var(--border);
            padding-block-start: 1.5rem;
            color: var(--muted);
            font-size: 0.9375rem;
          }

          @media (max-width: 30rem) {
            .container {
              padding-inline: 1.25rem;
            }

            .callout {
              padding: 1.25rem;
            }

            .feed-url {
              padding: 0.625rem 0.75rem;
              font-size: 0.875rem;
            }
          }
        </style>
      </head>
      <body>
        <main class="container">
          <p class="eyebrow">RSS feed</p>
          <h1><xsl:value-of select="title" /></h1>
          <p class="tagline"><xsl:value-of select="description" /></p>

          <div class="callout">
            <h2>You are looking at an RSS feed</h2>
            <p>
              It is not broken. RSS lets you follow this blog from an app of your choice, with no
              account, no algorithm and no email address. Copy the address below and paste it into
              your feed reader.
            </p>
            <code class="feed-url">
              <xsl:choose>
                <xsl:when test="atom:link[@rel='self']/@href">
                  <xsl:value-of select="atom:link[@rel='self']/@href" />
                </xsl:when>
                <xsl:otherwise>
                  <xsl:value-of select="link" />rss.xml
                </xsl:otherwise>
              </xsl:choose>
            </code>
            <p>
              New to this? <a href="https://aboutfeeds.com/">About Feeds</a> is a short, friendly
              introduction to RSS and the readers you can use.
            </p>
          </div>

          <h2 class="section-heading">Latest articles</h2>
          <ul class="items">
            <xsl:apply-templates select="item" />
          </ul>

          <p class="site-link">
            <a href="{link}">&#8592; Back to <xsl:value-of select="link" /></a>
          </p>
        </main>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="item">
    <li>
      <p class="meta">
        <xsl:value-of select="substring(pubDate, 1, 16)" />
        <xsl:if test="dc:creator">
          <xsl:text> &#183; </xsl:text>
          <xsl:value-of select="dc:creator" />
        </xsl:if>
      </p>
      <h3 class="item-title">
        <a href="{link}"><xsl:value-of select="title" /></a>
      </h3>
      <p class="summary">
        <!-- `description` carries HTML for feed readers. Pull the text out of the leading
             paragraph rather than re-emitting markup, which XSLT 1.0 cannot do safely. -->
        <xsl:choose>
          <xsl:when test="contains(description, '&lt;p&gt;')">
            <xsl:value-of select="substring-before(substring-after(description, '&lt;p&gt;'), '&lt;/p&gt;')" />
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="description" />
          </xsl:otherwise>
        </xsl:choose>
      </p>
    </li>
  </xsl:template>
</xsl:stylesheet>
