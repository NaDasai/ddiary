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

import Transactions from "./Transactions";

import pageflip from "../data/pageflip.mp3";

import "../styles.css";

import { Moralis } from "moralis";


const useStyles = makeStyles((theme) => ({
  tokenImg: {
    height: "2rem",
    width: "2rem",
  },
}));

export default function Assets() {


  const { isAuthenticated } = useMoralis();

  const [datesToAddClassTo, setDatesToAddClassTo] = useState([]);

  const [date, setDate] = useState(new Date());


      useEffect(() => {
        if(isAuthenticated){
            onChangeDate(date); 
            //console.log("date in useEffect: " + date)
            getAllTransactions();
    }
  }, [isAuthenticated, date]); 

    async function onChangeDate(nextValue) {
      setDate(nextValue);
      console.log("nextValue: " + nextValue)
      console.log("date: " + date)
      const pageflipAudio = new Audio(pageflip);
      pageflipAudio.play();
    }


    function isSameDay(d1, d2) {
      return d1 === d2;
    }

    async function getAllTransactions() {

      const queryTo = new Moralis.Query("EthTransactions");
      queryTo.equalTo("to_address", Moralis.User.current()).get("ethAddress");
      const queryFrom = new Moralis.Query("EthTransactions");
      queryFrom.equalTo("from_address", Moralis.User.current().get("ethAddress"));

      const query = Moralis.Query.or(queryTo, queryFrom);

      const results = await query.find();
      // Do something with the returned Moralis.Object values
      let datesToAdd = [];
      for (let i = 0; i < results.length; i++) {
        const object = results[i];
        console.log(object.get('block_timestamp').toLocaleDateString() );
        datesToAdd.push(object.get('block_timestamp').toLocaleDateString());

      }

      // unique dates
      datesToAdd = [...new Set(datesToAdd)];

      setDatesToAddClassTo(datesToAdd);
    }
    
     function tileClassName({ date, view }) {    
      
      console.log("datesToAddClassTo: " + datesToAddClassTo)
      // Add class to tiles in month view only
      if (view === 'month') {
        // Check if a date React-Calendar wants to check is on the list of dates to add class to
        if (datesToAddClassTo.find(dDate => isSameDay(dDate, date.toLocaleDateString()))) {
          console.log("found")
          return "boldate";
        }
      }
    }

    async function generateBS(e) {

      const query = new Moralis.Query("EthTransactionsFiles");
      //query.equalTo("to_address", Moralis.User.current()).get("ethAddress");
      const EthTransactionFile = await query.find();
      let transactionsAipfs = [];
      if(EthTransactionFile)
      {
        for (let i = 0; i < EthTransactionFile.length; i++) {
          const object = EthTransactionFile[i];
          transactionsAipfs.push(object.get('transaction_hash'));
          transactionsAipfs.push("\n");
          transactionsAipfs.push(object.get('ipfs'));
          transactionsAipfs.push("\n");
          transactionsAipfs.push("\n");
  
        }

        const element = document.createElement("a");
    const file = new Blob(transactionsAipfs, {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "myFifi.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();

      }
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
    <div>
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
        onChange={(v) => onChangeDate(v)}
        value={date}
        maxDate={new Date()}
        tileClassName={tileClassName}
      />
      <button onClick={(e) => generateBS(e)}>
        Generate balance sheet
      </button>
    </div>
    <br />
    <div id="container" class="center">
      <Transactions date={date}/>
      </div>
      </CardContent>
      </Card>
    </div>
  );
}
