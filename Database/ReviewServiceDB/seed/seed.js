const mysql = require("mysql2")
const fs = require("fs")
const seedSql = fs.readFileSync("db/seedDiffUC.sql", {
	encoding: "utf-8"
})

const connection  = mysql.createConnection({
	host: "localhost",
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	multipleStatements: true
})

connection.connect()

console.log("Running Sql seed ...")

// please if not a new or clean DB check what is the lastId and sent it as parameter
connection.query(seedSql, (result, err) => {
	if(err) {
		throw err
	}else {
		console.log(result)
		console.log("DB seeded, enjoy!")
	}
})

console.log("Closing Connection!")
connection.end()
