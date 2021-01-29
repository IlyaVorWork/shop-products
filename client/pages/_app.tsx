import { themes } from '../.storybook/preview'
import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import ThemeProvider from '../providers/ThemeProvider'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles: any = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <ThemeProvider theme={themes[0]}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
