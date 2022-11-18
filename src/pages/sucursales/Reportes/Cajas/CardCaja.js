import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import {Badge, Box} from '@material-ui/core';
 
const StyledBadge = withStyles((theme) => ({
    badge: {
      color :({props})=> props.color,
      background: ({props})=> props.color,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    }
  }))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth:230,
    maxWidth: 230,
    margin:5,
    
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    color: red[500],
  },
  textActive:{
    position:'relative',
    bottom:8
  }
}));

export default function CardCaja(props) {
    const styleProps={
      color: (props.activa)  ? '#44b700' : 'red'
    }
    const classes = useStyles();
 
    return (
        <div>
            <Card className={classes.root}>
                    <CardHeader
                      color="secondary"
                        avatar={
                            <StyledBadge
                              overlap="circular"
                              props={styleProps}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                              variant="dot"
                              badgeContent=""
                            >
                            <Avatar alt="Cajero X" src="/static/images/avatar/1.jpg" />
                            </StyledBadge>
                        }
                    />
                    <Box m={1} mb={2}>
                    <Typography variant="h4" color="textSecondary" component="p" >
                            Caja {props.name}
                    </Typography>
                    </Box>
                    {/* <CardActions disableSpacing  >
                        <Typography style={{fontWeight: 'bold'}} color="textSecondary" component="p">
                           Total en caja: 
                        </Typography>
                        <Typography style={{margin: '0px 10px', color: 'green'}} variant="h6" color="textSecondary" component="p">
                           $ {parseFloat(props.cantidad_efectivo_actual)}
                        </Typography>
                    </CardActions> */}
                </Card>
        </div>
    )
}
