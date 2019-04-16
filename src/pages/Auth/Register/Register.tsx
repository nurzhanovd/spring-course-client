import React, { useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { User } from '../../../models';


const styles = (theme): any => ({
    main: {
        width: 'auto',
        display: 'block',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

export const SignUp = (props) => {
    const { classes } = props;

    const [user, setUserField] = useState<Partial<User>>({});
    const [confPassword, setConfPassword] = useState<string>('');

    const validateForm = (user: User, confPassword: string): boolean => {
        if (
            user.email &&
            user.name &&
            user.password &&
            confPassword &&
            confPassword === user.password
        ) {
            return true
        } else {
            return false;
        }
    } 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm(user as User, confPassword)) {
            const targetUser  = await fetch(`http://localhost:8080/auth/sign-up`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                email: user.email,
                password: user.password,
                name: user.name
            })

        })

        props.history.push('/login')


        } else {
            alert('Не все поля заполнены');
        }
    }


    return (
        <main className={classes.main}>
            <CssBaseline />
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <Input
                            value={ user.email }
                            onChange={ (e) => setUserField({...user, email: e.target.value}) }
                            id="email"
                            name="email"
                            autoFocus 
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <Input
                            value={ user.name }
                            onChange={ (e) => setUserField({...user, name: e.target.value}) }  
                            id="name"
                            name="name"
                            autoFocus 
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input
                            value={ user.password }
                            onChange={ (e) => setUserField({...user, password: e.target.value}) }
                            name="password"
                            type="password"
                            id="password"
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="confPassword">Confirm password</InputLabel>
                        <Input
                            value={ confPassword }
                            onChange={ (e) => setConfPassword(e.target.value) }
                            name="confPassword"
                            type="password" 
                            id="confPassword"  
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={ handleSubmit }
                    >
                        Sign Up
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={ () => props.history.push('/login') }
                    >
                        Sign in
                    </Button>
                </form>
            </Paper>
        </main>
    );
}


export default withStyles(styles)(withRouter(SignUp));