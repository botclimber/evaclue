"use strict"

const SubApi = "http://localhost"

const subEmail = document.getElementById("subEmail")
const subStatus = document.getElementById("subStatus")

async function getSuitableMsg(msg) {
  console.log(msg)
  switch(msg){
    case "Email subscribed, thanks!": return "A sua subscrição à nossa newsletter foi concluída com sucesso. Obrigado por fazer parte da nossa comunidade!";
    case "Email already existing!": return "Informamos que o endereço de e-mail fornecido já se encontra registado na nossa base de dados.";
    case "No email given or written in a wrong format": return "Por favor, insira um endereço de e-mail válido para concluir a subscrição da nossa newsletter.";
    default: return "no conclusion"
  }
}

async function subSubmit(){
    console.log("starting ...")
    console.log(subEmail.value)

    if(subEmail.value != ""){
      console.log(SubApi)
      const resp = await fetch(`${SubApi}/notifications/v1/sub`,{
          method: 'POST',
          body: JSON.stringify({email: subEmail.value}),
          headers: {
            'Content-Type': 'application/json'
          }
        })

      const data = await resp.json()
      console.log(data)

      subStatus.innerHTML = await getSuitableMsg(data.msg)

    }else subStatus.innerHTML = "Insira um endereço de e-mail."
}
