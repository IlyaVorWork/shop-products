import React, { useEffect } from 'react'
import App, { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { SnackbarProvider } from 'notistack'

import withApollo from '@graphql/apolloClient'
import ThemeProvider from '@providers/ThemeProvider'
import AppController from '@controllers/AppController'
import { themes } from '../.storybook/preview'

import 'sanitize.css'
import '@public/styles/global.sass'

const MyApp = ({
  Component,
  pageProps,
  apollo,
}: AppProps | any): JSX.Element => {
  useEffect(() => {
    const jssStyles: any = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <ThemeProvider theme={themes[0]}>
      <AppController>
          <ApolloProvider client={apollo}>
            <SnackbarProvider>
              <Component {...pageProps} />
            </SnackbarProvider>
          </ApolloProvider>
      </AppController>
    </ThemeProvider>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  return { ...appProps }
}

export default withApollo(MyApp)
