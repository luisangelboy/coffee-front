import React, { Fragment, useContext, useState } from 'react'
import PropTypes from 'prop-types';
import { AppBar, Box, Button, Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { FcDonate } from 'react-icons/fc';

import CloseIcon from '@material-ui/icons/Close';
import FormRegistroEgresos from './FormRegistroEgresos';
import moment from 'moment';
import { TesoreriaCtx } from '../../../../context/Tesoreria/tesoreriaCtx';


function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-reg-product-${index}`}
			aria-labelledby={`reg-product-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3} minHeight="70vh">
					{children}
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
};

function a11yProps(index) {
	return {
		id: `reg-product-tab-${index}`,
		'aria-controls': `tabpanel-reg-product-${index}`
	};
}

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper
	},
	iconSvg: {
		width: 50
	},
	iconSize: {
		fontSize: 40,
        color: theme.palette.info.main
	},
	buttons: {
		'& > *': {
			margin: `0px ${theme.spacing(1)}px`
		}
	}

}));

export default function VistaRegistroEgreso({handleClickOpen}) {
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const classes = useStyles();
    const [ value, setValue ] = useState(0);

    const handleChange = (event, newValue) => {
		setValue(newValue);
	};

    return (
        <Fragment>
			<div className={classes.root}>
				<AppBar position="static" color="default" elevation={0}>
					<Tabs
						value={value}
						onChange={handleChange}
						variant="scrollable"
						scrollButtons="on"
						textColor='primary'
						indicatorColor='primary'
						aria-label="scrollable force tabs example"
					>
						<Tab
							label="Egreso a Contado"
							icon={<FcDonate className={classes.iconSize} />}
							{...a11yProps(0)}
						/>
						<Grid container justifyContent="flex-end">
							<Box mt={4}>
								<Typography>Usuario: <b>{sesion.nombre}</b></Typography> 
								<Box>
									<b>{moment().locale("es-mx").format('D MMMM YYYY')}</b>
								</Box>
							</Box>
							
						</Grid>
						<Grid>
							<Box mt={3} ml={5} display="flex" justifyContent="flex-end">
								<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
									<CloseIcon />
								</Button>
							</Box>
						</Grid>
					</Tabs>
				</AppBar>
				<TabPanel value={value} index={0}>
					<FormRegistroEgresos handleClickOpen={handleClickOpen} tipo='CONTADO' />
				</TabPanel>
			</div>
        </Fragment>

    )
}
