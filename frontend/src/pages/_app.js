import '@/styles/globals.css'

import React, { useState } from 'react'
import { Noto_Sans, Noto_Sans_Thai } from 'next/font/google'
import { ConfigProvider } from 'antd'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import theme from '@/styles/themeConfig'

const notoSans = Noto_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
})

const notoSansThai = Noto_Sans_Thai({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-noto-sans-thai',
})

const initialQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { refetchOnWindowFocus: false, retry: false },
    },
  })
  queryClient.setQueryData(['CHAT_CENTER'], () => '')
  return queryClient
}

const App = ({ Component, pageProps }) => {
  const [queryClient] = useState(initialQueryClient)

  return (
    <>
      <style jsx global>{`
        :root {
          --font-noto-sans: ${notoSans.style.fontFamily};
          --font-noto-sans-thai: ${notoSansThai.style.fontFamily};
        }
        html {
          font-family: ${notoSans.style.fontFamily};
        }
      `}</style>
      <ConfigProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
        </QueryClientProvider>
      </ConfigProvider>
    </>
  )
}

export default App
