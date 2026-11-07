import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
 palette:{mode:'light',primary:{main:'#9F1239',dark:'#6B0F2A',contrastText:'#fff'},secondary:{main:'#D97706'},background:{default:'#FFF8F1',paper:'#fff'},text:{primary:'#2B1B17',secondary:'#8B7766'},divider:'#F1E3D3',success:{main:'#15803D'},error:{main:'#B91C1C'}},
 typography:{fontFamily:'Inter, system-ui, sans-serif',h1:{fontFamily:'Georgia, serif',fontWeight:600},h2:{fontFamily:'Georgia, serif',fontWeight:600},h3:{fontFamily:'Georgia, serif',fontWeight:600},button:{textTransform:'none',fontWeight:600}},
 shape:{borderRadius:12},components:{MuiCard:{styleOverrides:{root:{border:'1px solid #F1E3D3',boxShadow:'0 5px 18px rgba(43,27,23,.05)'}}},MuiButton:{styleOverrides:{root:{borderRadius:10,textTransform:'none'}}}}
});
