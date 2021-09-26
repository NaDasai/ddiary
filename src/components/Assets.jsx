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

const useStyles = makeStyles((theme) => ({
  tokenImg: {
    height: "2rem",
    width: "2rem",
  },
}));

export default function Assets() {


  const { Moralis, isAuthenticated } = useMoralis();

  function millisecondsToTime (ms) {
    let minutes = Math.floor(ms / (1000 * 60));
    let hours = Math.floor(ms / (1000 * 60 * 60));
    let days = Math.floor(ms / (1000 * 60 * 60 * 24));
    
    if (days < 1) {
        if (hours < 1) {
            if (minutes < 1) {
                return `less than a minute ago`
            } else return `${minutes} minutes(s) ago`
        } else return `${hours} hours(s) ago`
    } else return `${days} days(s) ago`
  }


  function setDivDate (transactions) {

    let currentDiv = document.getElementById("divtransactions");
    currentDiv.innerHTML = "";

    if (transactions.length > 0) {

      console.log("We are in setDiv")

      let table = `
      <table class="table">
      <thead>
      <tr>
      <th scope="col">Transaction</th>
      <th scope="col">Block Number</th>
      <th scope="col">Age</th>
      <th scope="col">Type</th>
      <th scope="col">Fee</th>
      <th scope="col">Value</th>
          </tr>
      </thead>
      <tbody id="theTransactions">
      </tbody>
      </table>
      `
      currentDiv.innerHTML = table;

    transactions.forEach((t) => {
    let content = `
    <tr>
        <td><a href='https://etherscan.io/tx/${t.attributes.hash}' target="_blank" rel="noopener noreferrer">${t.attributes.hash}</a></td>
        <td><a href='https://etherscan.io/block/${t.attributes.block_number}' target="_blank" rel="noopener noreferrer">${t.attributes.block_number}</a></td>
        <td>${millisecondsToTime(Date.parse(new Date()) - Date.parse(t.attributes.block_timestamp))}</td>
        <td>${t.attributes.from_address == Moralis.User.current().get('ethAddress') ? 'Outgoing' : 'Incoming'}</td>
        <td>${((t.attributes.gas * t.attributes.gas_price) / 1e18).toFixed(5)} ETH</td>
        <td>${(t.attributes.value / 1e18).toFixed(5)} ETH</td>
        <td><Button>${t.attributes.block_timestamp}</Button></td>
    </tr>
    `
    currentDiv.innerHTML += content;
    //console.log((new Date(t.block_timestamp)).toLocaleDateString())
    console.log("Each transaction: " + JSON.stringify(t))
    console.log("hash: " + t.attributes.hash)
    console.log(t.get('hash'))
})
}
}

  
  //WEB3API FUNCTIONS
  async function Transactions() {
  // The transactions are hardcoded to retrieve only rinkeby transactions. 
  // you can change that here:
  const options = { chain: "Eth" };
  const transactions = await Moralis.Web3API.account.getTransactions(options);

  console.log("Transactions " + transactions);
  
  // all transactions
  //setDivDate (transactions);

}

const [valueDate, onChange] = useState(new Date());

      useEffect(() => {
        if(isAuthenticated){
          window.onload = function () {
            Transactions();
            }
    }
    }, [isAuthenticated]); 

    async function onChangeDate(nextValue) {
      onChange(nextValue);

      // set lessThan date
      let nextDate = new Date(nextValue);
      nextDate.setDate(nextDate.getDate()+1);

      let query = new Moralis.Query('EthTransactions')
      query.greaterThan("block_timestamp", new Date(nextValue));
      query.lessThan("block_timestamp", nextDate);
      const resultDateTransaction = await query.find()

      console.log("First date " + nextValue); // .toLocaleDateString()
      console.log("First date string " + nextValue.toLocaleDateString());
      console.log("Next date " + nextDate);
      console.log("Result date " + resultDateTransaction.length);
      console.log("Result date " + resultDateTransaction);

      setDivDate (resultDateTransaction);

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
        <div>
      <Calendar
        onChange={onChangeDate}
        value={valueDate}
        maxDate={new Date()}
      />
    </div>
    <div id="container">
        <Typography gutterBottom>Transactions</Typography>
      <div id="divtransactions"></div>
      </div>
      </CardContent>
      </Card>
    </div>
  );
}
