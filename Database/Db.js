var mysql = require('mysql2');

module.exports = class DB {

	#sqlValuesTypeSafer = (value) => {
		switch (typeof (value)) {
			case 'string': return '"' + value + '"'; break;
			default: return value

		}
	}

	constructor() {

		this.con = mysql.createConnection({
			host: "localhost",
			user: "root", // switch to your current user
			password: "greedisgood", // switch to your current password
			database: "renReviews_db",
			waitForConnections: true
		});

		// test connection
		this.connect()
	}

	connect() {
		this.con.connect(function (err) {
			if (err) throw err;
			console.log("Connected to DB!");
		});
	}


	/**
	 * Method to insert object into the database
	 * @param object object to insert into database
	 * @return Id of object
	*/
	async insert(object) {
		console.log('Inserting data into ' + object.constructor.name + '...')

		const columnNames = Object.keys(object).join(',')
		const values = Object.values(object).map(_ => this.#sqlValuesTypeSafer(_)).join(',')

		const sql = `INSERT INTO ${object.constructor.name} (${columnNames}) VALUES (${values})`;

		const res = await this.con.promise().execute(sql);
		return res[0].insertId
	}


	/**
	 * Method to return all entries of a table
	 * @param tableName Table Name to get entries from
	 * @return Entries of table
	*/
	async selectAll(tableName) {
		console.log('Getting all data from ' + tableName + '...')

		const sql = 'SELECT * FROM ' + tableName

		const res = await this.con.promise().execute(sql)
		return res[0]
	}

	/**
	 * Method to get an object by ID
	 * @param tableName Table Name to get the object from
	 * @param id Id of the object
	 * @return Requested object
	*/
	async selectOne(tableName, id) {

		console.log('Getting data from ' + tableName + ' where id is ' + id)

		const sql = 'SELECT * FROM ' + tableName + ' WHERE id = ?'

		const res = await this.con.promise().execute(sql, [id])
		return res[0][0]
	}




	/**
	* Method to update multiple entries 
	* @param chgConfig chgConfig= {tableName: ,id: , columns: [], values: []} :object
	*/
	async update(chgConfig) {

		console.log('Updating data on table ' + chgConfig.tableName)

		const toBeUpdated = chgConfig.columns.map((value, key) => value + '=' + this.#sqlValuesTypeSafer(chgConfig.values[key])).join()
		const sql = 'UPDATE ' + chgConfig.tableName + ' SET ' + toBeUpdated + ' WHERE id = ' + chgConfig.id

		const res = await this.con.execute(sql, function (err, result) {
			if (err) throw err;
			else console.log(result.changedRows + " row(s) updated")
		})
	}

	/**
	we should think about what we really want to delete
	*/
	//del(){}

	close() {
		this.con.end(function (err) {
			if (err) throw err;
			console.log("Connection closed!");
		})
	}
}








