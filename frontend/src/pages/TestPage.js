import Bills from '../components/bills/Bills'
import Loans from '../components/loans/Loans'
import React, { useState } from 'react'
import { Menu, Box, AppBar, Toolbar, IconButton, Container, MenuItem, Typography} from '@mui/material/';
import MenuIcon from '@mui/icons-material/Menu'
// import { useNavigate } from 'react-router-dom';
function Dash() {

  // const navigate = useNavigate();
  // const pages = ['BillCreation', 'Loan reation', 'YourBills', 'YourLoans']
  const [anchorElNav, setAnchorElNav] = useState(null)
  // const handleCloseNavMenu = () => {
  //   setAnchorElNav(null);
  // };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const bill = {
    id: "1",
    amount: "50",
    creditor: "Ryan",
    description: "WATER BILL",
    date: new Date(),
    diffTime: 50,
    payments: [{}]
  }
  const bill0 = {
    id: "2",
    amount: "50",
    creditor: "Ryan",
    description: "WATER BILL",
    date: new Date(),
    diffTime: 50,
    payments: [{}]
  }

  const payment = {
    id: "1",
    bill: "1",
    amount : "50"
  }
  const payment0 = {
    id: "2",
    bill: "2",
    amount : "50"
  }
  const bills = [{}]
  const mates = [{}]
  const payments = [payment,payment0]

  const loans = [bill, bill0]
  const postPay = (amount, id) => {
    console.log(amount),
    console.log(id)
  }

  const delPay = (billID, payID) => {
    console.log(billID)
    console.log(payID)
  }

  const deleteLoan = (loanID) => {
    console.log(loanID)
  }

  // const logout = () => {
  //   navigate('/')
  // }
  return (
    <Box sx={{flexGrow: 1}}>
    <AppBar position="static">
      <Container maxWidth="x1">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          arial-label="menu"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                <MenuItem>
                  <Typography textAlign="center">HELLO</Typography>
                </MenuItem>
                <MenuItem>
                  <Typography textAlign="center">HELLO</Typography>
                </MenuItem>
            </Menu>
    </IconButton>
    </Toolbar>
    </Container>
        </AppBar>
      <Loans loans={loans} mates={mates} deleteLoan={deleteLoan}/>
      <Bills bills={bills} mates={mates} payments = {payments} postPay = {postPay} delPay={delPay}/>
    </Box>
    );
}

export default Dash;
