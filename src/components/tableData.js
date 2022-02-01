import * as React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import "./css/tableData.css";

import { useSelector } from "react-redux"
import { useDispatch } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionCreators } from "../store/index";

function TableData() {

    const state = useSelector((state) => state.metorState);
    const baseURL = state.baseUrl;

    const dispatch = useDispatch();
    const { setMetorListState, getMetorListState } = bindActionCreators(actionCreators, dispatch);

    const [metorsList, setMetorsList] = React.useState([]);
    const [tempMetorsList, setTempMetorsList] = React.useState([]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [tableHeaders, setTableHeaders] = React.useState(['id','name','nameType','recclass','mass','fall','year','reclat','reclong']); 

    const [name, setName] = React.useState("");
    const [year, setYear] = React.useState("");
    const [mass, setMass] = React.useState("");

    

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    React.useEffect(() => {
        axios.get(baseURL).then((response) => {
            setMetorsList(response.data);
            setTempMetorsList(response.data);
            setMetorListState(response.data);
        });
    }, []);

    React.useEffect(() => {
        if(name.length === 0 && year.length === 0 && mass.length === 0){
            setTempMetorsList(metorsList);
        }
        else{
            var results = metorsList.filter(item => (item.name.toLowerCase() === name.toLowerCase() ||
                                                    new Date(item.year).toLocaleDateString().split('/')[2] === year) ||
                                                    (item.mass != undefined && item.mass === mass && mass.length > 0)
                                                );
            //console.log(results);
            setTempMetorsList(results);
        }
    }, [name,year,mass]);


    function searchInDb(){
        // console.log(name);
        // console.log(year);
        // console.log(mass);
    }

    return (
        <div className="container">
            <div className="filterBar">
                <p>Filter Data By: </p>
                <TextField size="small" className="filterInput" label="name" variant="outlined" value={name} onChange={e => setName(e.target.value)} />
                <TextField size="small" className="filterInput" label="year" variant="outlined" value={year} onChange={e => setYear(e.target.value)} />
                <TextField size="small" className="filterInput" label="mass" variant="outlined" value={mass} onChange={e => setMass(e.target.value)} />
                {/* <Button variant="contained" className="filterInput" onClick={searchInDb}>Search</Button> */}
            </div>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                    {tableHeaders.map(title => (
                        <TableCell key={title}>{title}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
            {
            tempMetorsList.length > 0 ? 
            (rowsPerPage > 0 ? tempMetorsList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage): 
                tempMetorsList).map((metor) => (
                    <TableRow key={metor.id}>
                        <TableCell>{metor.id}</TableCell>
                        <TableCell>{metor.name}</TableCell>
                        <TableCell>{metor.nametype}</TableCell>
                        <TableCell>{metor.recclass}</TableCell>
                        <TableCell>{metor.mass}</TableCell>
                        <TableCell>{metor.fall}</TableCell>
                        <TableCell>{new Date(metor.year).toLocaleDateString()}</TableCell>
                        <TableCell>{metor.reclat}</TableCell>
                        <TableCell>{metor.reclong}</TableCell>
                    </TableRow>
                )): <p> Cant Find any resualt tha much your filter option</p>
            }
            </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={metorsList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Paper>
      </div>
    );
}

export default TableData;
