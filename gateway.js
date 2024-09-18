var express = require('express');
var app = express();

const bodyParser = require('body-parser');
var xml2js = require('xml2js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const request = require('request');


var soap = require('strong-soap').soap;

app.post('/api/smartGate', function (req, res) {

	console.log(req.body); 
	
	requestData = req.body;
	var serviceId = req.body.serviceId;

	var config = {
        user: 'root',
        password: '',
        server: 'localhost', 
        database: 'Gateway' 
    };

    // For MS SQL Server DB Connection

    /*var sql = require("mssql");

    new sql.ConnectionPool(config).connect().then(pool => {

		return pool.request().query("SELECT TOP 1 * FROM Service where systemId = "+serviceId)

	}).then(result => {

		rows = result.recordset[0];
		console.log(JSON.stringify(rows));
		sql.close();
		
		if(rows['dataTypeId'] == 1){
			connectToSoap(rows['serviceURI'], rows['soapMethod'],requestData)
		}
		
		if(rows['dataTypeId'] == 2){
			prepareDataBaseConnection(serviceId, rows['dbConnectionId'], rows['dbTypeId'])
		}

		if(rows['dataTypeId'] == 3){
			connectToXML(rows['serviceURI'], requestData)
		}
	}).catch(err => { 
		var responseData = {};
		console.log("result > "+err);
		responseData.responseCode = 451 ;
		responseData.responseMessage = "Server is being updated, please wait!";
		console.log(responseData);
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.status(200).json(responseData);
	});	*/

	// For MySQL DB Connection, Using Wamp Server

	var mysql = require('mysql');

	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "",
	  database: "Gateway"
	});

	con.connect(function(err) {
	  if (err) throw err;
	  con.query("SELECT * FROM Service where systemId = "+serviceId, function (err, result, fields) {
	    if (err) throw err;
	    console.log(result[0]);

	    rows = result[0];
		console.log(JSON.stringify(rows));
		
		//mysql.close();
		
		if(rows['dataTypeId'] == 1){
			connectToSoap(rows['serviceURI'], rows['soapMethod'],requestData)
		}
		
		if(rows['dataTypeId'] == 2){
			prepareDataBaseConnection(serviceId, rows['dbConnectionId'], rows['dbTypeId'])
		}

		if(rows['dataTypeId'] == 3){
			connectToXML(rows['serviceURI'], requestData)
		}
	  });
	});


	function prepareDataBaseConnection(serviceId, dbConnId, dbType){
		new sql.ConnectionPool(config).connect().then(pool => {

			return pool.request().query("SELECT TOP 1 * FROM DataBaseConnection where systemId = "+dbConnId)

		}).then(result => {

			rows = result.recordset[0];
			console.log(JSON.stringify(rows));
			sql.close();

			if(dbType == 3){
				tempConfig = {};
				tempConfig.host = rows['databaseHost'];
				tempConfig.database = rows['databaseName'];
				tempConfig.user = rows['username'];
				tempConfig.password = (rows['password'] == null) ? "" : rows['password'];
				bringServiceDBQuery(serviceId, tempConfig, dbType, requestData);
			}

			if(dbType == 2){
				tempConfig = {};
				tempConfig.server = rows['databaseHost'];
				tempConfig.database = rows['databaseName'];
				tempConfig.user = rows['username'];
				tempConfig.password = (rows['password'] == null) ? "" : rows['password'];
				prepareMSSQLDBQuery(serviceId, tempConfig, dbType, requestData);	
			}
			
			
		}).catch(err => { 
			var responseData = {};
			console.log("result > "+err);
			responseData.responseCode = 451 ;
			responseData.responseMessage = "Server is being updated, please wait!";
			console.log(responseData);
			res.setHeader('Access-Control-Allow-Origin', '*')
			res.status(200).json(responseData);
		});	
	}

	function bringServiceDBQuery(serviceId, dbConfig, dbType,requestData){
		console.log(serviceId)
		new sql.ConnectionPool(config).connect().then(pool => {

			return pool.request().query("SELECT TOP 1 * FROM ServiceDataBaseQuery where serviceId = "+serviceId)

		}).then(result => {

			rows = result.recordset[0];
			console.log(JSON.stringify(rows));
			sql.close();

			console.log(rows['query']);
			var query = rows['query'];

			for (var property in requestData) {
		   		if(property != 'serviceId' ){
		   			fieldName = '@'+property;
		   			query = query.replace(fieldName, requestData[property]);
		   		}
		   	}

		   	console.log(query);

		   	connectToMySql(dbConfig, query);
			
		}).catch(err => { 
			var responseData = {};
			console.log("result > "+err);
			responseData.responseCode = 451 ;
			responseData.responseMessage = "Server is being updated, please wait!";
			console.log(responseData);
			res.setHeader('Access-Control-Allow-Origin', '*')
			res.status(200).json(responseData);
		});	
	}

	function prepareMSSQLDBQuery(serviceId, dbConfig, dbType,requestData){
		console.log(serviceId)
		new sql.ConnectionPool(config).connect().then(pool => {

			return pool.request().query("SELECT TOP 1 * FROM ServiceDataBaseQuery where serviceId = "+serviceId)

		}).then(result => {

			rows = result.recordset[0];
			console.log(JSON.stringify(rows));
			sql.close();

			console.log(rows['query']);
			var query = rows['query'];

			for (var property in requestData) {
		   		if(property != 'serviceId' ){
		   			fieldName = '@'+property;
		   			query = query.replace(fieldName, requestData[property]);
		   		}
		   	}

		   	console.log(query);

		   	connectToMSSQL(dbConfig, query);
			
		}).catch(err => { 
			var responseData = {};
			console.log("result > "+err);
			responseData.responseCode = 451 ;
			responseData.responseMessage = "Server is being updated, please wait!";
			console.log(responseData);
			res.setHeader('Access-Control-Allow-Origin', '*')
			res.status(200).json(responseData);
		});	
	}

	function connectToSoap(uri, methodName, requestData){
	
	   	url = uri;
	   	requestArgs = {};
	   	
	   	for (var property in requestData) {
	   		if(property != 'serviceId' ){
	   			requestArgs[property] = requestData[property];
	   		}
	   	}

	   	console.log(requestArgs);
	   	console.log(methodName +" >> "+ url);
		 
		var options = {};
		try{
			soap.createClient(url, options, function(err, client) {
			  	
			  	console.log(err);
			  	if(err == null){
				  	var method = client[methodName];

				  	method(requestArgs, function(err, result, envelope, soapHeader) {
				    	console.log('Response Envelope: \n' + envelope);
				    	//console.log('Result: \n' + JSON.stringify(result));
				    
						result.responseCode = 0 ;
						result.responseMessage = "Success";
					
						res.setHeader('Access-Control-Allow-Origin', '*')
						res.status(200).json(result);
				  	});
			  	} else {
			  		response = {};
			  		response.responseCode = 500 ;
					response.responseMessage = "Failed to connect to server";
					res.setHeader('Access-Control-Allow-Origin', '*')
					res.status(200).json(response);
			  	}
			});
		} catch(e){
			result.responseCode = 500 ;
			result.responseMessage = "Data inconsistency, please make sure that data are configured properly";
			res.setHeader('Access-Control-Allow-Origin', '*')
			res.status(200).json(result);
		}
	}

	function connectToMSSQL(dbConfig, dbQuery){

		new sql.ConnectionPool(dbConfig).connect().then(pool => {

			return pool.request().query(dbQuery)

		}).then(result => {

			rows = result.recordset;
			console.log(JSON.stringify(rows));
			
			responseData = {};

			responseData.responseCode = 0;
			responseData.responseMessage = "Success";
			responseData.data = rows;		
			res.setHeader('Access-Control-Allow-Origin', '*')
			res.status(200).json(responseData);	

		}).catch(err => { 
			var responseData = {};
			console.log("result > "+err);
			responseData.responseCode = 451 ;
			responseData.responseMessage = "Server is being updated, please wait!";
			console.log(responseData);
			res.setHeader('Access-Control-Allow-Origin', '*')
			res.status(200).json(responseData);
		});
	}

	function connectToMySql(dbConfig, dbQuery){

		var mysql = require('mysql');

		var con = mysql.createConnection(dbConfig);

		con.connect(function(err) {
		  	if (err) throw err;
		  	con.query(dbQuery, function (err, result, fields) {
			    if (err) {

			    	var responseData = {};
					responseData.responseCode = 322 ;
					responseData.responseMessage = "Query syntax error!";
					responseData.data = result;
					res.setHeader('Access-Control-Allow-Origin', '*')
					res.status(200).json(responseData);

			    } else {
				    
				    console.log("Result length >>"+result.length);
				    if(result.length > 0){

					    var responseData = result[0];
						responseData.responseCode = 0 ;
						responseData.responseMessage = "Success";
						res.setHeader('Access-Control-Allow-Origin', '*')
						res.status(200).json(responseData);
					} else{
						responseData.responseCode = 301 ;
						responseData.responseMessage = "No data returned";
						res.setHeader('Access-Control-Allow-Origin', '*')
						res.status(200).json(responseData);
					}
				}
			});
		});
	}

	function connectToXML(uri, requestData){

		requestArgs = {};
	   	
	   	for (var property in requestData) {
	   		if(property != 'serviceId' ){
	   			requestArgs[property] = requestData[property];
	   		}
	   	}

		var builder = new xml2js.Builder();
		var xmlData = builder.buildObject(requestArgs);

		console.log(xmlData)

		request.post({
		    url:"uri",
		    method:"POST",
		    headers:{
		        'Content-Type': 'application/xml',
		    },
		     body: xmlData
		},
		function(error, response, body){
		    
		    responseData = {};
		    var parseString = require('xml2js').parseString;
			var xml = response;
			parseString(xml, function (err, result) {
				console.dir(result);
				responseData = result;
			});

		    if(error){
		    	errResponse = {};
		    	errResponse.responseCode = -1;
		    	errResponse.responseMessage = "Failed";
		    	res.setHeader('Access-Control-Allow-Origin', '*')
				res.status(response.statusCode).json(errResponse);
		    } else { 
		    	responseData.responseCode = 0;
		    	responseData.responseMessage = "Success";
		    	res.setHeader('Access-Control-Allow-Origin', '*')
				res.status(200).json(responseData);
		    }
		});
	}

});

var server = app.listen(5057, function () {
    console.log('Server is running.. on 5057');
});