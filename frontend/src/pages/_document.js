import React from 'react'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import config from '@/configs'

const facebookScript = {
  __html: `window.fbAsyncInit=function(){FB.init({appId:${config.fbAppId},autoLogAppEvents:!0,xfbml:!0,version:"v13.0"})};`,
}
const MyDocument = () => (
  <Html lang="en">
    <Head />
    <body>
      <script dangerouslySetInnerHTML={facebookScript} />
      <script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js"
      ></script>
      <Main />
      <NextScript />
    </body>
  </Html>
)

MyDocument.getInitialProps = async (ctx) => {
  const cache = createCache()
  const originalRenderPage = ctx.renderPage
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    })

  const initialProps = await Document.getInitialProps(ctx)
  const style = extractStyle(cache, true)
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  }
}

export default MyDocument