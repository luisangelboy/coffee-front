import { grey } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
	palette: {
		navbar: grey[50],
		primary: {
			main: "#2222a8"
		},
		secondary: {
			main: '#f50057'
		},
		secondaryCafi: "#3f3f3f"
	}
});

export default theme;
