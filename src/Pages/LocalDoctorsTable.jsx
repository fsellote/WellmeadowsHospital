import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import supabase from '../Services/Supabase';
import { TableContainer } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#311432', 
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const LocalDoctorsTable = ({ reload }) => {
  const [docList, setDocList] = useState([]);

  useEffect(() => {
    fetchDocList();
  }, [reload]);

  async function fetchDocList() {
    try {
      const { data, error } = await supabase
        .from('local_doctors')
        .select('*');

      if (error) {
        console.error('Error fetching Local Doctors:', error.message);
        return;
      }

      setDocList(data);
    } catch (error) {
      console.error('Error fetching Local Doctors:', error.message);
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Clinic Number</StyledTableCell>
            <StyledTableCell>Full Name</StyledTableCell>
            <StyledTableCell>Address</StyledTableCell>
            <StyledTableCell>Telephone Number</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {docList.map((listDoctor) => (
            <StyledTableRow key={listDoctor.clinic_num}>
              <StyledTableCell>{listDoctor.clinic_num}</StyledTableCell>
              <StyledTableCell>{listDoctor.full_name}</StyledTableCell>
              <StyledTableCell>{listDoctor.address}</StyledTableCell>
              <StyledTableCell>{listDoctor.tel_number}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default LocalDoctorsTable;
