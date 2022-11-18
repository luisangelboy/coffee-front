//layouts
import LayoutLogin from '../components/Layouts/LayoutLogin';
import LayoutAdmin from '../components/Layouts/LayoutAdmin';
import LayoutVentas from '../components/Layouts/LayoutVentas';
import LayoutHome from '../components/Layouts/LayoutHome';

//sucursales pages
import AdminInicio from '../pages/sucursales/AdminInicio'

//ventas pages
/* import Venta_index from '../pages/ventas/venta_index' */

const routes = [
	{
		path: '/',
		component: LayoutLogin,
		exact: true
	},
	{
		path: '/home',
		component: LayoutHome,
		exact: true
	},
	{
		path: '/admin',
		component: LayoutAdmin,
		exact: false,
		routes: [
			{
				path: '/admin/inicio',
				component: AdminInicio,
				exact: true,
			}
		]
	},
	{
		path: '/ventas/venta-general',
		component: LayoutVentas,
		exact: false
	}
	
];

export default routes;
