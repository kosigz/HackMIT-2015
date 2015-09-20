// Link Files
var clarifai = require('./clarifai');

// Retrieve MongoClient
var MongoClient = require('mongodb').MongoClient;

// Database connection.
var database = null;

// Collections.
var users;
/* Users
- id	
- username
*/
var items;
/* Items
- id	
- item_id	
- name		
- expiration_date (ms)
*/
var durability;
/* Durability
- item_id	
- durability (ms)
*/

// Connect to Mongo Database.
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
	if(err) throw err;
	console.log("Database connection successful.");
	database = db;
	initCollections();
});

// Create collections.
function initCollections () {
	database.collection('Users', function(err, collection) {
		if (err) throw err;
		users = collection;
	});
	database.collection('Items', function(err, collection) {
		if (err) throw err;
		items = collection;
	});
	database.collection('Durability', function(err, collection) {
		if (err) throw err;
		durability = collection;
	});
}

// Get User.
// Client sends a username. We should send back at User ID.
exports.getIDForUsername = function (username, res) {
	users.find({username: username}).toArray(function (err, data) {
		if (err) throw err;
		// if the result size is zero, generate and add and ID.
		if (data.length == 0) {
			var id = Math.floor(Math.random() * 1000000) + 1000000;
			users.insert({username: username, id: id});
			res.send({
				id: id
			})
		}
		// otherwise, send the first result's username.
		else {
			var userRecord = data[0];
			console.log(userRecord)
			res.send({
				id: userRecord.id
			})
		}
	});
}

// Get Items.
// Gets all items out of the database for a given user ID.
exports.getItems = function (id, res) {
	items.find({id: id}).toArray(function (err, data) {
		if (err) throw err;
		res.send(data);
	});
}

// Delete Item.
// Deletes an item with a given ID from a user with the same ID.
exports.deleteItem = function(id, itemID, res) {
	items.remove({id: id, item_id: itemID});
	res.sendStatus(200);
}

// Add Item.
// Adds an item to the database.
// Should also decide what that item is.
exports.addItem = function () {
	// Upload the file to some URL. Get the URL.

	// Process the file with the API.

	// Post classification to the database.

	// Return to the client what their file was classified as.
}

