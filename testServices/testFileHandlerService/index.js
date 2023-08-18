async function request(id){
    switch(id) {
        case "revFiles": {
            const url = "http://localhost:8049/v1/fileHandler/addReviewImgs"
            const randomId = 27
            const paramIdName = "reviewId"
            const paramName = "reviewImgs"
        
            await toEndPoint(url, "POST", id, randomId, paramIdName, paramName)
        }; break;

        case "resFiles": {
            const url = "http://localhost:8049/v1/fileHandler/addResImgs"
            const randomId = 26
            const paramIdName = "resId"
            const paramName = "resImgs"
        
            await toEndPoint(url, "POST", id, randomId, paramIdName, paramName)
        }; break;
        case "resProofDoc": {
            const url = "http://localhost:8049/v1/fileHandler/addResDoc"
            const randomId = 27
            const paramIdName = "resId"
            const paramName = "proofDocFiles"
        
            await toEndPoint(url, "POST", id, randomId, paramIdName, paramName)
        }; break;
        case "ticketAttach": {
            const url = "http://localhost:8049/v1/fileHandler/addTicketAttach"
            const randomId = 27
            const paramIdName = "ticketId"
            const paramName = "ticketAttachFiles"
        
            await toEndPoint(url, "POST", id, randomId, paramIdName, paramName)
        }; break;
    }

}

async function toEndPoint(url, method, id, randomId, paramIdName, paramName) {
    const mulFiles = document.getElementById(id).files
    const data = new FormData()

    data.append(paramIdName, randomId)
    for(const file of mulFiles){ data.append(paramName, file) }
    
    console.log(data.getAll(paramName))

    // test fetch
    const response = await fetch(url, {
        method: method,
        body: data
    })

    const txt = await response.json()

    console.log(txt)
}