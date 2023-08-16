async function request(){
    const mulFiles = document.getElementById('testFiles').files

    const data = new FormData()
    
    data.append("reviewId", 28) // random id 
    for(const file of mulFiles){ data.append(`reviewImgs`, file) }
    
    console.log(data.getAll("reviewImgs"))

    // test fetch
    const response = await fetch("http://localhost:8049/v1/fileHandler/addReviewImgs", {
        method: "POST",
        body: data
    })

    console.log(response)

}