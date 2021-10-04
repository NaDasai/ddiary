import { Moralis } from "moralis";
import { useMoralisFile } from "react-moralis";



export default function File ({t}) {

    const {  saveFile } = useMoralisFile(); //   error, isUploading, moralisFile, saveFile,

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
        await EthTransactionFile.save().then(function(file) { // await user.save()??
            console.log("upload done", file)
          }, function(error) {
            console.log("there was an error", error);
          });
  } 
      else
      {
       
       const EthTransactionFile = new Moralis.Object('EthTransactionsFiles')
       EthTransactionFile.set("transaction", object);
       EthTransactionFile.set("transactionFile", moralisFile);
       EthTransactionFile.set("ipfs", moralisFile.ipfs());
       EthTransactionFile.set("hash", moralisFile.hash());
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

 return (
    <td>
     <input type="file" id="notesFile" onChange={(e) => uploadFile(e, t)}></input>
     <button onClick={(e) => displayFile(t)}>Open file</button>
     </td>
     );

}  