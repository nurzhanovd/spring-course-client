import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import { Car } from '../../models';
import { withRouter } from 'react-router-dom';
import './styles.scss';

class ICarsTableState {
    carList: Car[] = [];

    constructor(...inits: Partial<ICarsTableState>[]){
        Object.assign(this, ...inits);
    }
}

const styles = {
    root: {
        width: '100%',
        marginTop: 30,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
}

class CarsTable extends React.Component<any, ICarsTableState> {

    constructor(props) {
        super(props);

        this.state = new ICarsTableState()
    }

    async fetchCars() {
        const response = await fetch('http://localhost:8080/cars/all', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        })
        const carList = await response.json()
        this.setState({
            carList
        })
    }

    componentDidMount() {
        this.fetchCars();
    }

    delete = async (car: Car) => {
        const response = await fetch(`http://localhost:8080/cars/${car.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        })

        this.fetchCars();
    }

    render() {

        return (
            <>
            <Button 
                variant="contained"
                color='primary'
                onClick={() => this.props.history.push('/create')}
            >
                Create
            </Button>
            <Paper className='paper'>
                <Table className='table'>
                    <TableHead>
                    <TableRow>
                        <TableCell>Car ID</TableCell>
                        <TableCell align="right">Mark</TableCell>
                        <TableCell align="right">Model</TableCell>                        
                        <TableCell align="right">Color</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.carList.map((car) => (
                                <TableRow key={car.id}>
                                    <TableCell component="th">
                                        {car.id}
                                    </TableCell>
                                    <TableCell align="right">{car.mark}</TableCell>
                                    <TableCell align="right">{car.model}</TableCell>
                                    <TableCell align="right">{car.color}</TableCell>
                                    <TableCell align="right">
                                        <Delete 
                                            style={{ marginRight: 10, cursor: 'pointer' }}
                                            onClick={ () => this.delete(car) }
                                        />
                                        <Edit 
                                            style={{ cursor: 'pointer' }}
                                            onClick={ () => this.props.history.push(`/edit/${car.id}`) }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Paper>
            </>
        )
    }
}



export default withRouter(CarsTable);
