import React, { useContext, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton'
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core'
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';
import { DeleteOutline } from '@material-ui/icons';

export default function TablaPreciosPlazos({ precios }) {
	/* const { preciosPlazos } = useContext(RegProductoContext); */

	return (

		<TableContainer component={Paper}>
			<Table aria-label="simple table" size="small">
				<TableHead>
					<TableRow>
						<TableCell>Plazo</TableCell>
						<TableCell>Precio</TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{precios.map((precio, index) => (
						<RenderTablePlazos key={index} precio={precio} index={index} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

const RenderTablePlazos = ({ precio, index }) => {

	return (
		<TableRow >
			<TableCell>{precio.plazo}</TableCell>
			<TableCell>{precio.precio}</TableCell>
			<TableCell>
				<ModalDeletePlazos index={index} unidad={precio.unidad} />
			</TableCell>
		</TableRow>
	)
}

const ModalDeletePlazos = ({ index, unidad }) => {
	const [open, setOpen] = useState(false);
	const { preciosPlazos, setPreciosPlazos } = useContext(RegProductoContext);

	const toggleModal = () => {
		setOpen(!open);
	};

	const eliminarUnidad = () => {


		switch (unidad) {
			case "Pz":
				preciosPlazos.precio_piezas.splice(index, 1);
				setPreciosPlazos({
                    ...preciosPlazos,
                    precio_piezas: [...preciosPlazos.precio_piezas]
                })
				break;
			case "Caja":
				preciosPlazos.precio_cajas.splice(index, 1);
				setPreciosPlazos({
                    ...preciosPlazos,
                    precio_cajas: [...preciosPlazos.precio_cajas]
                })
				break;
			case "Costal":
				preciosPlazos.precio_costales.splice(index, 1);
				setPreciosPlazos({
                    ...preciosPlazos,
                    precio_costales: [...preciosPlazos.precio_costales]
                })
				break;
			default:
				break;
		}
		toggleModal();
	};

	return (
		<div>
			<IconButton color="primary" onClick={() => toggleModal()}>
				<DeleteOutline color="primary" />
			</IconButton>
			<Dialog open={open} onClose={toggleModal}>
				<DialogTitle>{'Se eliminará este precio'}</DialogTitle>
				<DialogActions>
					<Button onClick={() => toggleModal()} color="primary">
						Cancelar
					</Button>
					<Button onClick={() => eliminarUnidad()} color="secondary" autoFocus>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
