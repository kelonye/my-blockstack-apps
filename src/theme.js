import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: ['Fira Mono', 'Avenir', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: '#404040',
    },
    // secondary: {
    //   main: '#19857b',
    // },
    // error: {
    //   main: red.A400,
    // },
    background: {
      default: '#fff',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 2,
      },
    },
  },
});

export default theme;
