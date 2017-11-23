var admin = require('firebase-admin');

var serviceAccount = require('./expressa-9cc49-firebase-adminsdk-6qm4d-68fc0aecc5.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://expressa-9cc49.firebaseio.com'
});
var db = admin.database();
db.ref('/language/enlish').remove();