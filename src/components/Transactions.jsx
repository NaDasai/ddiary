import { useEffect, useState } from "react";

import { Moralis } from "moralis";
import { useMoralisQuery } from "react-moralis";

import File from "./File";


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


export default function Transactions ({date}) {
    
    // set lessThan date
        let nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate()+1);
              
        const { data, error, isLoading } = useMoralisQuery("EthTransactions", query =>
        query
          .greaterThan("block_timestamp", date)
          .lessThan("block_timestamp", nextDate),
          [date],
      );

    
      const [tdata, settData] = useState(data);
  
      useEffect(() => {
        if (data) {
            settData(data);
        }
      }, [data]);
      
    console.log("Transactions json: " + JSON.stringify(data, null, 2))
    
    if (!error & tdata.length > 0) {

    return (
      <table border = "1" bordercolor = "blue">
      <caption>{tdata.length} transaction(s) {date.toLocaleDateString()} {millisecondsToTime(Date.parse(new Date()) - Date.parse(date))}</caption>
      <thead>
      <tr>
      <th scope="col">Transaction</th>
      <th scope="col">Block Number</th>
      <th scope="col">Type</th>
      <th scope="col">Value</th>
      <th scope="col">Fee</th>
      <th scope="col">Notes</th>
          </tr>
      </thead>
      <tbody>
      {tdata.map((t) => {
          console.log("hash " + t.attributes.hash)
          console.log("objectId " + t.attributes.objectId)
          console.log("object " + t)
          return(
        <tr>
            <td><a href='https://etherscan.io/tx/${t.attributes.hash}' target="_blank" rel="noopener noreferrer">${t.attributes.hash}</a></td>
            <td><a href='https://etherscan.io/block/${t.attributes.block_number}' target="_blank" rel="noopener noreferrer">${t.attributes.block_number}</a></td>
            <td>${t.attributes.from_address == Moralis.User.current().get('ethAddress') ? 'Outgoing' : 'Incoming'}</td>
            <td>${(t.attributes.value / 1e18).toFixed(5)} ETH</td>
            <td>${((t.attributes.gas * t.attributes.gas_price) / 1e18).toFixed(5)} ETH</td>
            <File t={t}/>
        </tr>
      ); })}
      </tbody>
      </table>
    );

}
else {
    return (<table border = "1" bordercolor = "blue"><caption>{tdata.length} transaction(s) {date.toLocaleDateString()} {millisecondsToTime(Date.parse(new Date()) - Date.parse(date))}</caption></table>);
}
}