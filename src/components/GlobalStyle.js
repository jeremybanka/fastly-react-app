import { createGlobalStyle } from "cosmo"

const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.sans};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${({ theme }) => theme.colors.grays[8]};
    background-color: ${({ theme }) => theme.colors.grays[0]};
  }
`

export default GlobalStyle
