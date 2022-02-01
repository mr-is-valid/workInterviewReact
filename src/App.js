import './App.css';
import * as React from 'react';
import TableData from './components/tableData';
import GraphData from './components/graphData';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  return (
    <div>
    <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Nasa DB
          </Typography>
        </Toolbar>
      </AppBar>
    <TableData></TableData>
    <GraphData></GraphData>
    </div>
  );
}

export default App;
