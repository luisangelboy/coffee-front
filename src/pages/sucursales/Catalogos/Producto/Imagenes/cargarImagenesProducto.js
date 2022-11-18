import React, { Fragment, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import { Box, Typography, Button, Divider, Grid } from '@material-ui/core';
import { AddPhotoAlternate, Visibility, Delete } from '@material-ui/icons';
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';

import PhotoSizeSelectActualOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActualOutlined';
const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		width: '100%',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(0)}px ${theme.spacing(1)}px`
	},
	input: {
		display: 'none'
	},
	imagen: {
		maxHeight: "100%",
		maxWidth: "100%"
	}
}));

export default function CargarImagenesProducto() {
	const classes = useStyles();
	const { imagenes, setImagenes, setOnPreview, onPreview } = useContext(RegProductoContext);

	const cargarImagen = (e) => {
		const { files } = e.target;
		if (e.target.files.length < 1) return
		setImagenes([
			...imagenes,
			files[0]
		]);
		setOnPreview({image: URL.createObjectURL(files[0])})
	};

	const render_imagenes = imagenes.map((res, index) => <RenderImagenes key={index} index={index} imagen={res} />);

	return (
		<Fragment>
			<Grid container>
				<Grid item md={6}>
					<Box>
						<input
							accept="image/*"
							className={classes.input}
							id="contained-button-file"
							/* multiple */
							type="file"
							onChange={cargarImagen}
						/>
						<label htmlFor="contained-button-file">
							<Button variant="text" color="primary" component="span" startIcon={<AddPhotoAlternate />}>
								Cargar imagen
							</Button>
						</label>
					</Box>
					{render_imagenes}
				</Grid>
				<Grid item md={6}>
					<Box display="flex" minHeight={300}>
						<Box mx={1}>
							<Divider orientation="vertical" />
						</Box>
						<Box width="100%" height="50vh" display="flex" justifyContent="center" alignItems="center">
							{!onPreview.image ? (
								<PhotoSizeSelectActualOutlinedIcon style={{ fontSize: 150 }} />
							) : (<img alt="img-onPreview" src={onPreview.image} className={classes.imagen} />)}

						</Box>
					</Box>
				</Grid>
			</Grid>
		</Fragment>
	);
}

const RenderImagenes = ({ imagen, index }) => {
	const classes = useStyles();
	const preview = imagen.key_imagen ? imagen.url_imagen : URL.createObjectURL(imagen)
	const { imagenes, setImagenes, setOnPreview, onPreview, imagenes_eliminadas, setImagenesEliminadas } = useContext(RegProductoContext);
	const [open, setOpen] = useState(false);
	const handleModal = () => setOpen(!open);

	const eliminarImagen = () => {
		/* agregar al arrya de imagenes eliminadas */
		if(imagen.key_imagen){
			setImagenesEliminadas([
				...imagenes_eliminadas, imagen
			])
		}
		/* quitar imagenes del array */
		if (onPreview.index === index) {
			setOnPreview({ index: '', image: '' })
		}
		const array = [...imagenes];
		array.splice(index, 1);
		setImagenes([
			...array,
		]);
		handleModal();
	}

	return (
		<Box my={2} mr={5}>
			<Box className={classes.formInputFlex}>
				<Box height={70} width={70}>
					<img alt="producto-img-prev" src={preview} width="100%" />
				</Box>
				<Box width="90%">
					<Typography noWrap>
						{imagen.key_imagen ? imagen.key_imagen : imagen.name}
					</Typography>
					{imagen.key_imagen ? null : (<Typography variant="caption">{imagen.size} bits</Typography>)}
					
					<Box display="flex" justifyContent="flex-end">
						<Button size="small" startIcon={<Visibility />} onClick={() => setOnPreview({ index, image: preview })}>
							previsualizar
						</Button>
						<Box mx={1} />
						<ModalDelete handleModal={handleModal} open={open} eliminarImagen={eliminarImagen} />
					</Box>
				</Box>
			</Box>
			<Divider />
		</Box>
	);
};

const ModalDelete = ({ handleModal, open, eliminarImagen }) => {
	return (
		<div>
			<Button size="small" color="secondary" startIcon={<Delete />} onClick={() => handleModal()}>
				eliminar
			</Button>
			<Dialog open={open} onClose={handleModal}>
				<DialogTitle>{'¿Seguro que quieres eliminar esto?'}</DialogTitle>
				<DialogActions>
					<Button onClick={() => handleModal()} color="primary">
						Cancelar
					</Button>
					<Button color="secondary" autoFocus variant="contained" onClick={() => eliminarImagen()}>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
