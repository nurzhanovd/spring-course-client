import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import EnhacedTableToolbar from './EnhacedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';


function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const styles = (theme): any => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});


class EnhancedTable extends React.Component<any, any> {
    state = {
        order: 'asc',
        orderBy: 'id',
        selected: [],
        data: [

        ],
        page: 0,
        rowsPerPage: 5,
        totalElement: 0
    };

    componentDidMount() {
        this.fetchCars();
    }

    async fetchCars() {
        const response = await fetch(`http://localhost:8080/cars/all?page=${this.state.page}&size=${this.state.rowsPerPage}&sort=${this.state.orderBy}&order=${this.state.order}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        })
        const carList = await response.json()
        console.log(carList)
        this.setState({
            data: carList.content,
            totalElement: carList.totalElements
        })
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: state.data.map(n => n.id) }));
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    componentDidUpdate(_, prevState) {
        const {
            page,
            rowsPerPage,
            order,
            orderBy
        } = this.state;

        const {
            page: prevPage,
            rowsPerPage: prevRowsPerPage,
            order: prevOrder,
            orderBy: prevOrderBy
        } = prevState;
        if (
            page !== prevPage || rowsPerPage !== prevRowsPerPage ||
            order !== prevOrder || orderBy !== prevOrderBy
        ) {
            this.fetchCars();
        }
    }

    delete = async (car: any) => {
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

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <div
                style={ {
                    width: '80%',
                    margin: 'auto'
                } }
            >
                <Paper className={classes.root}>
                    <EnhacedTableToolbar numSelected={selected.length} />
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={data.length}
                            />
                            <TableBody>
                                {data && data.length ? data
                                    .map(n => {
                                        const isSelected = this.isSelected(n.id);
                                        return (
                                            <TableRow
                                                hover
                                                onClick={event => this.handleClick(event, n.id)}
                                                role="checkbox"
                                                aria-checked={isSelected}
                                                tabIndex={-1}
                                                key={n.id}
                                                selected={isSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={isSelected} />
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    {n.id}
                                                </TableCell>
                                                <TableCell align="right">{n.mark}</TableCell>
                                                <TableCell align="right">{n.model}</TableCell>
                                                <TableCell align="right">{n.color}</TableCell>
                                                <TableCell align="right">
                                                    <Delete 
                                                        style={{ marginRight: 10, cursor: 'pointer' }}
                                                        onClick={ () => this.delete(n) }
                                                    />
                                                    <Edit 
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={ () => this.props.history.push(`/edit/${n.id}`) }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }) : null}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 49 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.state.totalElement}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        );
    }
}


export default withStyles(styles)(EnhancedTable);
