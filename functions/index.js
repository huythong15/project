var admin		= require("firebase-admin");
// Fetch the service account key JSON file contents
var serviceAccount	= require("./expressa-9cc49-firebase-adminsdk-6qm4d-68fc0aecc5.json");
var functions		= require("firebase-functions");
var promise		    = require("promise");
// SERVER host
var express    		= require("express");        // call express
var app 			= express();                 // define our 
//search 
//var fulltextsearchlight = require("full-text-search-light");
//var search = new fulltextsearchlight();


// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://expressa-9cc49.firebaseio.com/"
});
var db = admin.database();


//=============================================API Listlanguage =============================================================//=====================================================

//CONECT SQL icon language
var refIconLanguage = db.ref("/icon/language");
var iconLanguage = [];
refIconLanguage.on("value", function(snapshot){
	iconLanguage = [];
	snapshot.forEach(function(childSnapshot){
		childSnapshot.forEach(function(childSnapshot1){
			var item = childSnapshot1.val();
			iconLanguage.push(item);
		});
	});
	return iconLanguage;
});


// CONECT SQL List Language
var refListlanguage = db.ref("/list_language");
var returnArr =[];

refListlanguage.on("value",function (snapshot) {
	returnArr = [];
	snapshot.forEach(function(childSnapshot) {
		var item = childSnapshot.val();
		item.id = childSnapshot.key;
		for (var i = 0; i < iconLanguage.length ; i++){
			if (iconLanguage[i].acronym == item.acronym ){
				item.link = iconLanguage[i].link_icon;
			}
		}
		returnArr.push(item);
	});
	return returnArr;
});


/**
 * @api {get} /api/listlanguage returns the data list language
 * @apiName listLanguage
 * @apiGroup List
 * 
 * @apiParam {string} Test
 * 
 * @apiSuccess {string} acronym Viet tat ten quoc gia
 * @apiSuccess {string} display_language Ten ngon ngu hien thi tren gia dien
 * @apiSuccess {string} index So thu tu xuat hien 
 * @apiSuccess {string} language Ten ngon ngu
 * @apiSuccess {number} version_time Timestamp moi lan them sua xoa
 * @apiSuccess {string} link Anh hien thi cua ngon ngu
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "acronym": "en",
 *  "display_language": "English",
 *  "eduka": "add-language",
 *  "index": "1",
 *  "language": "english",
 *  "version_time": 1511406509064,
 *  "id": "english",
 *  "link": "https://firebasestorage.googleapis.com/v0/b/nodejs-2fa91.appspot.com/o/icon%20language%2Fspain_flag.png?alt=media&token=9be1832d-f2c1-46a3-a810-7079db4e1c61"
 * }
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 NotFound
 * {
 * "error":"userNotFound"
 * }
 */
//API Get list Language
app.get("/api/listlanguage", function(req , res){
	res.json({"list_language":returnArr});
});


//==============================================API ListCategory=========================================================================================
// CONECT DATA LANGUAGE
var refData = db.ref("/language");

//CONECT SQL icon Category
var refIconCategory = db.ref("/icon/category");
var iconCategory = [];
refIconCategory.on("value", function(snapshot){
	iconCategory = [];
	snapshot.forEach(function(childSnapshot){
		childSnapshot.forEach(function(childSnapshot1){
			var item = childSnapshot1.val();
			iconCategory.push(item);
		});
	});
	return iconCategory;
});

///CONECT SQL CATEGORY
function findOcronym(acronym){
	var dataCategory =[];
	refData.on("value",function (snapshot) {
		dataCategory = [];
		snapshot.forEach(function(childSnapshot) {
			var item = childSnapshot.val().category;
			for (var i=0; i < item.length; i++){
				for (var j =0; j < iconCategory.length; j++)
					if (item[i].acronym == acronym && item[i].id_category == iconCategory[j].id_category){
						item[i].link = iconCategory[j].link_icon;
						item[0].sumsub = 5;
						item[1].sumsub = 15;
						item[2].sumsub = 13;
						item[3].sumsub = 15;
						item[4].sumsub = 12;
						item[5].sumsub = 9;
						item[6].sumsub = 41;
						dataCategory.push(item[i]);
					}
			}
		});
	});
	return dataCategory;
}

//APi category
/**
 * @api {get} /api/category?language= Lay danh sach Category
 * @apiName Category
 * @apiGroup List
 * @apiParam {string}  language ten viet tat cua ngon ngu
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError UserNotFoundError
 */
app.get("/api/category", function(req, res){
	var acronym = req.query.language;
	res.json({"category":findOcronym(acronym)});
});

//==============================================API Subcategory =========================================================================================
// Tinh sum value cua subcategory
var sumSub = [];
refData.on("value", function(snapshot){
	sumSub =[];
	snapshot.forEach(function(childSnapshot){
		childSnapshot.forEach(function(childSnapshot1){
			var a = childSnapshot1.numChildren();
			var item ={};
			item.sum = a;
			//sumSub.push(item);
			childSnapshot1.forEach(function(childSnapshot2){
				item.id_subcategory = childSnapshot2.val().id_subcategory;
			});
			sumSub.push(item);
		});
	});
	return sumSub;
});


//CONECT SQL SUB
function findIdcategory(acronym, id_category){
	var dataSubCategory =[];
	refData.on("value",function (snapshot) {
		dataSubCategory = [];
		snapshot.forEach(function(childSnapshot) {
			var item = childSnapshot.val().subcategory;
			//var sum = childSnapshot.val();

			for (var i=0; i < item.length; i++){
				for (var j=0; j <sumSub.length;j ++)
					if (item[i].acronym == acronym && item[i].id_category == id_category && item[i].id_subcategory == sumSub[j].id_subcategory){
						item[i].Sum = sumSub[j].sum;
						dataSubCategory.push(item[i]);
						break;
					}
			}
		});
	});
	return dataSubCategory;
}


//Api Subcategory
/**
 * @api {get} /api/subcategory?language=&id_category= Lay danh sach Subcategory tu id Category
 * @apiName SubCategory
 * @apiGroup List
 * @apiParam {string}  language ten viet tat cua ngon ngu
 * @apiParam {string}  id_category id cua category
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError UserNotFoundError
 */
app.get("/api/subcategory", function(req, res){
	//res.send('ctegory' + req.params.id_category)
	var acronym = req.query.language;
	var id_category = req.query.id_category;
	res.json({"subcategory":findIdcategory(acronym,id_category)});
});

//==============================================API DataSubcategory =========================================================================================
// CONECT SQL DATAsubcategory
function findIdSubcategory(acronym,id_category,id_subcategory){
	var dataSubCategoryChild = [];
	refData.on("value", function(snapshot){
		dataSubCategoryChild = [];
		snapshot.forEach(function(childSnapshot){
			childSnapshot.forEach(function(childSnapshot1){
				childSnapshot1.forEach(function(childSnapshot2){
					var item = childSnapshot2.val();
					if (item.id_category == id_category && item.acronym == acronym && item.id_subcategory == id_subcategory && item.subcategories == null){
						dataSubCategoryChild.push(item);
					}
				});
			});
		});
	});
	return dataSubCategoryChild; 
}


// API DATA subcategory
/**
 * @api {get} /api/datasubcategory?language=&id_category=&id_subcategory= Lay danh sach Subcategory tu id Category
 * @apiName dataSubCategory
 * @apiGroup Data
 * @apiParam {string}  language ten viet tat cua ngon ngu
 * @apiParam {string}  id_category id cua category
 * @apiParam {string}  id_subcategory id cua subcategory
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError UserNotFoundError
 */
app.get("/api/datasubcategory", function(req, res){
	var acronym = req.query.language;
	var id_category = req.query.id_category;
	var id_subcategory = req.query.id_subcategory;
	res.json({"subcategory":findIdSubcategory(acronym,id_category,id_subcategory)});

});

//==============================================API SearchTag =========================================================================================
//Danh sach tat ca cac Subcategory
var dataS = [];
var dataS2 =[];
refData.on("value", function(snapshot){
	dataS = [];

	snapshot.forEach(function(childSnapshot){
		//var item = childSnapshot.val().subcategory;
		childSnapshot.forEach(function(childSnapshot1){
			if(childSnapshot1.key == "subcategory"){
				dataS.push(childSnapshot1.val());
				
			}
		});
	});
	for (var i=0; i < dataS.length ; i++)
		for (var j=0; j < dataS[i].length; j++)
			dataS2.push(dataS[i][j]);
	
	// dataS3=[];
	for (var k=0; k <sumSub.length;k ++){
		for(var t =0; t< dataS2.length; t++)
			if(sumSub[k].id_subcategory == dataS2[t].id_subcategory){
				dataS2[t].Sum = sumSub[k].sum;				
			}
	}
	
	return dataS2;
});
// dataS2 la danh sach tat ca cac subcategory

// search Tag 
function tagSearch(key_word, acronym ){
	var searchList =[];
	refData.on("value",function (snapshot) {
		searchList = [];
		snapshot.forEach(function(childSnapshot) {
			childSnapshot.forEach(function(childSnapshot1){
				//var key = childSnapshot1.key;
				childSnapshot1.forEach(function(childSnapshot2){
					var item = childSnapshot2.val();
					//console.log(item);
					//item.key = key;
					for (var i=0; i<dataS2.length; i++)
					//console.log('aaaaaa'+dataS2[i].english);
						if ((item.english == key_word || item.translate== key_word) && item.acronym == acronym && dataS2[i].acronym == acronym && dataS2[i].id_subcategory == item.id_subcategory){//dataS2[i].acronym && item.id_subcategory == dataS2[i].id_subcategory
							item.english = dataS2[i].english;
							item.translate = dataS2[i].translate;
							item.subcategories = dataS2[i].subcategories;
							item.Sum = dataS2[i].Sum;
							item.key_word = key_word;
							searchList.push(item);
							delete item.level;
							//item.level.remove();
							break;
						}
				});
			});
		});
	});
	return searchList;
}

// API serch
app.get("/api/search", function(req, res){
	var key_word = req.query.key_word;
	var acronym = req.query.language;
	res.json({"search":tagSearch(key_word, acronym)});

});


//==============================================API SearchTag =========================================================================================
var searchtag = db.ref("search");
function searchTag(key_word, acronym){
	var resulSearchTag = [];
	searchtag.on("value", function(snapshot){
		snapshot.forEach(function(childSnapshot){
			childSnapshot.forEach(function(childSnapshot1){
				childSnapshot1.forEach(function(childSnapshot2){
					var item = childSnapshot2.val();
					//console.log('thu ' + item);
					for (var i=0; i<dataS2.length; i++)
					//console.log('aaaaaa'+dataS2[i].english);
						if (item.key_word == key_word && item.acronym == acronym && dataS2[i].acronym == acronym && dataS2[i].id_subcategory == item.subcategory){
							item.Sum = dataS2[i].Sum;
							item.subcategories = dataS2[i].subcategories;
							resulSearchTag.push(item);
							break;
						}

				});
			});
		});
	});
	return resulSearchTag;
}


/**
 * @api {get} /api/searchtag?language=&id_category=&key_word= Tim kiem Subcategory theo tuf khoa
 * @apiName searchtag
 * @apiGroup Search
 * @apiParam {string}  language ten viet tat cua ngon ngu
 * @apiParam {string}  key_word tu khoa tim kiem
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError UserNotFoundError
 */
app.get("/api/searchtag", function(req, res){
	var key_word = req.query.key_word;
	var acronym = req.query.language;
	res.json({"searchTag": searchTag(key_word,acronym)});
});

//==============================================API Vesion SearchTag =========================================================================================
var versionSearch;
searchtag.on("value", function(snapshot){
	var item = snapshot.val();
	//versionSearch.push(item.versionSearch);
	return versionSearch = item.versionSearch;
});


/**
 * @api {get} /api/versionsearch Phien ban hien tai
 * @apiName versionsearch
 * @apiGroup Search
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError UserNotFoundError
 */
app.get("/api/versionsearch", function(req, res){
	res.json({"versionSearch": versionSearch});
});

//==============================================API data Search autosucgest =========================================================================================
// API data search
function searchKey(acronym){
	var allsearchR =[];
	var allsearch = [];
	//allData =[];
	searchtag.on("value", function(snapshot){
		allsearch = [];
		snapshot.forEach(function(childSnapshot){
			//var key = childSnapshot.key;
			//console.log("thu" + key); 
			childSnapshot.forEach(function(childSnapshot1){
				childSnapshot1.forEach(function(childSnapshot2){
					var item = childSnapshot2.val();
					//console.log('test item'+ item.acronym);
					if (item.acronym == acronym && item.key_word != null){
						allsearch.push(item.key_word);
					}
				});
			});
		});
		for( var i =0; i < allsearch.length; i++){
			if ( allsearchR.indexOf(allsearch[i])< 0){
				allsearchR.push(allsearch[i]);
			}
		}
	});
	return allsearchR;

}


/**
 * @api {get} /api/allsearch data subcategory 
 * @apiName allsearch
 * @apiGroup Search
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError UserNotFoundError
 */
app.get("/api/allsearch", function(req , res){
	var acronym = req.query.language;
	res.json({"alldataSearch":searchKey(acronym)});
});

//========
// var resul = [];
// //var nameSub;
// //var key;
// //var resulFini =[];
// //var resulFini1 =[];
// var search_data_raw = [];
// //var search_data_fini = [];
// var keySearch = function(language, key_word){
// 	resul =[];
// 	refData.on("value",function(snapshot){
// 		//var key = snapshot.key;
// 		//if(key == 'english')
// 		snapshot.forEach(function(childSnapshot){
// 			//var key = childSnapshot.key;
// 			//if (key == 'english')
// 			childSnapshot.forEach(function(childSnapshot1){
// 				//childSnapshot1.forEach(function(childSnapshot2){
// 				//key = childSnapshot1.key.toString;
// 				var item = childSnapshot1.val();
// 				for ( var i = 0; i< item.length; i++ )	
// 					//if (item.acronym == 'en' )
// 					if(item[i].acronym == language)
// 						//if(item[i].id_subcategory == item[i+1].id_subcategory)
// 						search.add(item[i]);
// 				//nameSub = item[i].subcategories;
// 				//}
// 			});
// 		});
// 		//resul = search.search('ye');
// 	});
// 	resul = search.search(key_word);
// 	search.drop();
// 	//return resul;ss
// 	//console.log("asdasd"+search);
// 	var groupBy = function(xs, key) {
// 		return xs.reduce(function(rv, x) {
// 			// if (x[key] == dataS2[i].id_subcategory)
// 			// x.subcategories = dataS2[i].subcategories;
// 			(rv[x[key]] = rv[x[key]] || []).push(x);
// 			// search_data_raw.push(rv);
// 			// search_data_raw.push()
// 			// for (var i=0; i<dataS2.length; i++){
// 			// 	for (var j=0; j< rv.length; j++){
// 			// 		if (rv[j].id_subcategory == dataS2[i].id_subcategory){
// 			// 			var item = {};
// 			// 			item.list_data = rv[j];
// 			// 			item.name = dataS2[i].subcategories;
// 			// 			item.id_subcategory = dataS2[i].id_subcategory;
// 			// 			search_data_raw.push(item);
// 			// 		}
// 			// 	}
// 			// }
// 			// return search_data_raw;
// 			//return JSON.stringify(rv);
		
// 			return rv;
			
				
			

// 		}, {});
// 	};
// 	var groubedByTeam=groupBy(resul, "id_subcategory");
// 	//console.log(groubedByTeam);
// 	//return groubedByTeam;
// 	for (var x in groubedByTeam){
// 		for (var i=0; i<dataS2.length; i++){
// 			//console.log(groubedByTeam[x]);
// 			for (var j = 0; j< groubedByTeam[x].length; j++)
// 				if (groubedByTeam[x][j].id_subcategory == dataS2[i].id_subcategory){
// 					var item = {};
// 					item.list_data = groubedByTeam[x];
// 					item.Sum = groubedByTeam[x].length;
// 					item.name = dataS2[i].subcategories;
// 					item.id_subcategory = dataS2[i].id_subcategory;
// 					//console.log('test'+item);
// 					break;
// 				}
// 		}
// 		search_data_raw.push(item);
// 	}
// 	//search.drop();
// 	return search_data_raw;
// };
// app.get("/api/enterSearch", function(req, res ){
// 	var language = req.query.language;
// 	var key_word = req.query.key_word;
// 	res.json({"keysearch":keySearch(language, key_word)});
// 	search_data_raw =[];
// 	//res.send(language + key_word);
// 	//res.json(resul);

// });


exports.app = functions.https.onRequest(app);