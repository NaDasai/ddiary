import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Box, Typography } from "@material-ui/core";
import MonetizationOnOutlinedIcon from "@material-ui/icons/MonetizationOnOutlined";
import PieChartIcon from "@material-ui/icons/PieChart";

import { useCoinData } from "../hooks/coinData";
import { c2 } from "../utils";
import Login from "./Login";

import { useMoralis } from "react-moralis";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import imageNoteBack from '../data/noteback.jpg';

import Transactions from "./Transactions";


const useStyles = makeStyles((theme) => ({
  tokenImg: {
    height: "2rem",
    width: "2rem",
  },
}));

export default function Assets() {


  const { isAuthenticated } = useMoralis();

  const [valueDate, onChange] = useState(new Date());


      useEffect(() => {
        if(isAuthenticated){
            onChangeDate(valueDate); 
            console.log("valueDate in useeffect: " + valueDate)
    }
  }, [isAuthenticated]); 

    async function onChangeDate(nextValue) {
      onChange(nextValue);
      console.log("nextValue: " + nextValue)
      console.log("valueDate: " + valueDate)
    }


  const { coinList, portfolioValue, isLoading } = useCoinData();
  const styles = useStyles();

  if (!coinList || !coinList.length || isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" gutterBottom>DDiary</Typography>
        <Typography>Connect an Ethereum wallet to manage your diary</Typography>
        <Login />
      </Box>
    );
  }

  return (
    <div style={{ backgroundImage: `url(${imageNoteBack})` }}>
      <Box my={2}>
        <Typography variant="h5" my={2}>
          {c2.format(portfolioValue)}
          <PieChartIcon fontSize="small" />
        </Typography>
      </Box>
      <Card variant="outlined">
        <CardContent>
          <Typography gutterBottom>All Assets</Typography>
          {coinList.map((token, i) => (
            <Box display="flex" justifyContent="space-between" mb={2} key={i}>
              <Box display="flex">
                <Box display="flex" alignItems="center">
                  {token.image ? (
                    <Avatar
                      className={styles.tokenImg}
                      src={token.image}
                      alt={token.symbol}
                    />
                  ) : (
                    <Avatar>
                      <MonetizationOnOutlinedIcon fontSize="large" />
                    </Avatar>
                  )}
                </Box>
                <Box display="flex" flexDirection="column" ml={1}>
                  <Typography variant="subtitle2">{token.name}</Typography>
                  <Typography variant="body1">
                    {token.valueTxt} {c2.format(token.price)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1">{c2.format(token.value)}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
        <div style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
      <Calendar
        onChange={onChangeDate}
        value={valueDate}
        maxDate={new Date()}
      />
    </div>
    <br />
    <div id="container">
      <Transactions date={valueDate}/>
      </div>
      </CardContent>
      </Card>
    </div>
  );
}
