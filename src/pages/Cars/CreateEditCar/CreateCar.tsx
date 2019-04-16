import React from 'react';
import { withRouter } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { Car, User } from '../../../models';

import './style.scss';

class ICreateEditCarState {
    car: Car = new Car();
    userList: User[] = [];
    selectedUser: string = '';

    constructor(...inits: Partial<ICreateEditCarState>[]) {
        Object.assign(this, ...inits);
    }
}

export class CreateEditCar extends React.Component<any, ICreateEditCarState> {

    constructor(props) {
        super(props);

        this.state = new ICreateEditCarState()
    }

    getParamId() {
        return this.props.match && this.props.match.params && this.props.match.params.id
    }

    componentDidMount() {
        const id = this.getParamId()
        if (id) {
            this.fetchCar(id)
        }
        this.fetchUsers()
    }
    
    setCarField(key: keyof Car, value) {
        const {car} = this.state;

        this.setState(() => ({
            car: {
                ...car,
                [key]: value
            },
            selectedUser: car.user.name
        }));
    }

    async fetchCar(id){
        const response = await fetch(`http://localhost:8080/cars/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        })
        const car = await response.json()
        this.setState({
            car,
            selectedUser: car.user.name
        })
    }

    async fetchUsers()  {
        const response = await fetch(`http://localhost:8080/users/all`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        })
        const userList = await response.json()
        this.setState({
            userList
        })
    }

    async handleSubmit() {
        await fetch(`http://localhost:8080/cars/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(this.state.car)
        })
        
        this.props.history.push('/')
    }

    render() {
        const { car, selectedUser } = this.state;
        return (
            <>
                <h1 className='header'>Create Car</h1>
                <form style={{
                display: 'flex',
                flexDirection: 'column',
                margin: 'auto',
                width: '50%'
                }} noValidate autoComplete='off'>

                    <TextField 
                        label='mark'
                        margin='normal'
                        variant='outlined'
                        onChange={(e) =>  this.setCarField('mark', (e.target as HTMLInputElement).value)}
                        value={ car && car.mark || '' }
                    />

                    <TextField 
                        label='model'
                        margin='normal'
                        variant='outlined'
                        onChange={(e) => this.setCarField('model', (e.target as HTMLInputElement).value)}
                        value={ car && car.model || '' }
                    />

                    <TextField 
                        label='color'
                        margin='normal'
                        variant='outlined'
                        onChange={(e) => this.setCarField('color', (e.target as HTMLInputElement).value)}
                        value={ car && car.color || '' }
                        style={{
                            marginBottom: 20
                        }}
                    />

                        <InputLabel 
                            htmlFor="user"
                        >
                            {
                                selectedUser.length ? selectedUser : 'User'
                            }
                        </InputLabel>
                    <FormControl>
                        
                        <Select
                            onChange={(e) => {
                                const { car } = this.state;
                                const { value: id } = e.target;
                                this.setState({
                                    car: {
                                        ...car,
                                        user: {
                                            ...car.user,
                                            id: +id
                                        }
                                    }
                                })
                            }}
                            value={ selectedUser }
                            input={
                                <OutlinedInput
                                    labelWidth={100}
                                    value={ selectedUser }
                                    type='text'
                                />
                            }
                        >
                            <MenuItem value=''>
                                None 
                            </MenuItem>
                            {
                                this.state.userList.map(user => (
                                    <MenuItem key={user.id} value={user.id}>
                                        { user.name }
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <div className="button-wrapper">
                        <Button 
                            className='button'
                            variant="outlined"
                            color="primary"
                            disabled={ !(car && car.mark && car.model && car.user && car.user.id && car.color) }
                            onClick={ () => this.handleSubmit() }
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </>
        )
    }
}

export default withRouter(CreateEditCar);
