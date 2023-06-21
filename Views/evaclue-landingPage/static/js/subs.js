"use strict"

const SubApi = "http://evaclue.com:8002"

const subEmail = document.getElementById("subEmail")
const subStatus = document.getElementById("subStatus")

async function subSubmit(){
    console.log("starting ...")
    console.log(subEmail.value)
    const resp = await fetch(`${SubApi}/notification/v1/sub`,{
        method: 'POST',
        body: JSON.stringify({email: subEmail.value}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    
    const data = await resp.json()
    subStatus.innerHTML = data.msg

}
