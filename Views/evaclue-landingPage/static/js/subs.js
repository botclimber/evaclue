"use strict"

const SubApi = "https://localhost:8002"

const subEmail = document.getElementById("subEmail")
const subStatus = document.getElementById("subStatus")

async function getSuitableMsg(msg) {
  console.log(msg)
  switch(msg){
    case "Email subscribed, thanks!": return "Obrigado por subscrever!";
    case "Email already existing!": return "Email já se encontra registado!";
    case "No email given or written in a wrong format": return "Email inserido nao é válido!";
    default: return "no conclusion"
  }
}

async function subSubmit(){
    console.log("starting ...")
    console.log(subEmail.value)

    if(subEmail.value != ""){
      const resp = await fetch(`${SubApi}/notification/v1/sub`,{
          method: 'POST',
          body: JSON.stringify({email: subEmail.value}),
          headers: {
            'Content-Type': 'application/json'
          }
        })

      const data = await resp.json()
      console.log(data)

      subStatus.innerHTML = await getSuitableMsg(data.msg)

    }else subStatus.innerHTML = "Insira um email!"
}
