import pageflip from "../data/pageflip.mp3";

import { Typography } from "@material-ui/core";

import { Moralis } from "moralis";

import { useMoralisQuery } from "react-moralis";


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

  const pageflipAudio = new Audio(pageflip);
  const playSound = audioFile => {
    audioFile.play();
}


export default function Transactions ({date}) {

    //playSound(pageflipAudio);

        // set lessThan date
        let nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate()+1);
              
        const { data, error, isLoading } = useMoralisQuery("EthTransactions", query =>
        query
          .greaterThan("block_timestamp", date)
          .lessThan("block_timestamp", nextDate),
          [date],
      );
      
    //console.log("Transactions json: " + JSON.stringify(data, null, 2))
    
    if (!error & data.length > 0) {

    return (
      <table border = "1" bordercolor = "blue">
      <caption>{data.length} transaction(s) {date.toLocaleDateString()}</caption>
      <thead>
      <tr>
      <th scope="col">Transaction</th>
      <th scope="col">Block Number</th>
      <th scope="col">Age</th>
      <th scope="col">Type</th>
      <th scope="col">Fee</th>
      <th scope="col">Value</th>
      <th scope="col">Notes</th>
          </tr>
      </thead>
      <tbody>
      {data.forEach((t) => {
          console.log("hash" + t.attributes.hash)
          return(
    <tr>
        <td><a href='https://etherscan.io/tx/${t.attributes.hash}' target="_blank" rel="noopener noreferrer">${t.attributes.hash}</a></td>
        <td><a href='https://etherscan.io/block/${t.attributes.block_number}' target="_blank" rel="noopener noreferrer">${t.attributes.block_number}</a></td>
        <td>${millisecondsToTime(Date.parse(new Date()) - Date.parse(t.attributes.block_timestamp))}</td>
        <td>${t.attributes.from_address == Moralis.User.current().get('ethAddress') ? 'Outgoing' : 'Incoming'}</td>
        <td>${((t.attributes.gas * t.attributes.gas_price) / 1e18).toFixed(5)} ETH</td>
        <td>${(t.attributes.value / 1e18).toFixed(5)} ETH</td>
        <td><input type="text" id="name" name="name"></input><button>Save</button></td>
    </tr>
      ); })}
      </tbody>
      </table>
    );

}
else {
    return (<Typography>No transactions</Typography>);
}
}