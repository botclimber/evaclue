/**
 * handle file upload
 */
const expFileUpload = require("express-fileupload")

const fileHandler = (files, fileName, path) =>{
    // call fileHandler(input.fileProof)
			if(!files || Object.keys(files).length === 0){  
				return res.status(400).json({message: "No file sent!"})

			}else{
				console.log("file recieved!")
				const recFile = files.file

				console.log("moving file ... " + path + fileName)
				recFile.mv(path + fileName , (err) => {
				if(err) return res.status(400).json({message: "some error occurred"+err}) });

			}
}

module.exports =  { fileHandler }