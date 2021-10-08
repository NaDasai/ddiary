import { Moralis } from "moralis";
import { useMoralisFile, useMoralis } from "react-moralis";
import React, { useState, useEffect } from "react";
import { InputLabel, Select, MenuItem } from "@material-ui/core";
import { Box } from "@material-ui/core";



export default function File ({t}) {

    const {  saveFile } = useMoralisFile(); //   error, isUploading, moralisFile, saveFile,
    const [categorySelected, setCategorySelected] = useState("");

  //   async function setData(object) {
    
  //   const query = new Moralis.Query("EthTransactionsFiles");
  //   query.equalTo("transaction", object);  
  //   const EthTransactionFile = await query.first();
  //   if(EthTransactionFile)
  //   {
  //     setCategorySelected(EthTransactionFile.get('category'));
  //   }

  // }

async function uploadFile(event, object) {
    
    if (event.target.files[0]) {

        const file = event.target.files[0];
        const fileName = event.target.files[0].name;
  
         console.log("objectId" + object)
         console.log("file: " + event.target.files[0])
         console.log("name: " + event.target.files[0].name)
  
         const moralisFile = await saveFile(fileName, file, {throwOnError: true, saveIPFS: true});
      
      
      
        // see if in DB
      const query = new Moralis.Query("EthTransactionsFiles");
      query.equalTo("transaction", object);  
      const EthTransactionFile = await query.first();
      if(EthTransactionFile)
      {
        EthTransactionFile.set("transactionFile", moralisFile);
        EthTransactionFile.set("ipfs", moralisFile.ipfs());
        EthTransactionFile.set("hash", moralisFile.hash());
        EthTransactionFile.set("transaction_hash", object.attributes.hash);
        EthTransactionFile.set("to_address", object.attributes.to_address);
        EthTransactionFile.set("from_address", object.attributes.from_address);
        EthTransactionFile.set("category", categorySelected);
        console.log("to_address TRANSACTION", object.attributes.to_address);
        await EthTransactionFile.save().then(function(file) { // await user.save()??
            console.log("upload done", file)
          }, function(error) {
            console.log("there was an error", error);
          });
  } 
      else // else change in DB
      {
       
       const EthTransactionFile = new Moralis.Object('EthTransactionsFiles')
       EthTransactionFile.set("transaction", object);
       EthTransactionFile.set("transactionFile", moralisFile);
       EthTransactionFile.set("ipfs", moralisFile.ipfs());
       EthTransactionFile.set("hash", moralisFile.hash());
       EthTransactionFile.set("transaction_hash", object.attributes.hash);
       EthTransactionFile.set("to_address", object.attributes.to_address);
       EthTransactionFile.set("from_address", object.attributes.from_address);
       EthTransactionFile.set("category", categorySelected);
       console.log("to_address TRANSACTION", object.attributes.to_address);
       await EthTransactionFile.save().then(function(file) { // await user.save()??
        console.log("upload done", file)
      }, function(error) {
        console.log("there was an error", error);
      });

    } 

    }
  }  

  async function displayFile(object) {

    console.log("clicked " + object)
    const query = new Moralis.Query("EthTransactionsFiles");
    query.equalTo("transaction", object);  
    const EthTransactionFile = await query.first();
    if(EthTransactionFile)
    {
    let fileUrl = EthTransactionFile.get("ipfs")
    if(fileUrl)
    {
        window.open(fileUrl, "_blank");
    } 
} 
else 
{
    alert("No file for this transaction.")
} 

      } 

      function colorCategory(param) {
        switch(param) {
          case "":
            return "#141414";
          case "Payments":
            return "#ff96ff";
          case "Airdrops":
            return "#59bcff";
          case "Mining/Staking":
            return "#8064ff";
          case "NFTs":
            return "#33bacc";
          default:
            return "#12032e";
        }
      }

      const { isAuthenticated } = useMoralis();

      useEffect(() => {

        if (isAuthenticated) {
          setCategorySelected(categorySelected);
        }
        else {
          console.log("Not connected");
        }

} , [categorySelected, isAuthenticated]);

function handleChangeCategory(event) {
  setCategorySelected(event.target.value);
}

const [categories] = useState([
  "",
  "Payments",
  "Airdrops",
  "Mining/Staking",
  "NFTs"
]);

 return (
    <td>
           <Box display="flex" justifyContent="center" p={1}>
     <InputLabel htmlFor="agent-simple">Category</InputLabel>
     <Select
        value={categorySelected}
        onChange={handleChangeCategory}
        inputProps={{
          name: "category",
          id: "categoryId"
        }}
        style={{color: colorCategory(categorySelected)}}
      >
        {categories.map((value, index) => {
          return <MenuItem value={value}>{value}</MenuItem>;
        })}
      </Select>
      </Box>
      <Box display="flex" justifyContent="center" p={1}>
     <input type="file" id="notesFile" onChange={(e) => uploadFile(e, t)}></input>
     <button onClick={(e) => displayFile(t)}>Open file</button>
     </Box>
     </td>
     );

}  