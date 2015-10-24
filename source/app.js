(function() {

	"use strict";

	// var Westley = require("./classes/Westley.js"),
	// 	library = require("./module.js"),
	// 	encoding = require("./tools/encoding.js"),
	// 	signing = require("./tools/signing.js");

	// var mainGroupID = encoding.getUniqueID(),
	// 	secondGroupID = encoding.getUniqueID(),
	// 	thirdGroupID = encoding.getUniqueID(),
	// 	firstEntryID = encoding.getUniqueID(),
	// 	secondEntryID = encoding.getUniqueID();

	// var parser = new Westley();
	// [
	// 	'cmm "This is \\\" a new \\\" comment"',
	// 	'fmt ' + signing.getFormat(),
	// 	'cgr 0 ' + mainGroupID,
	// 	'tgr ' + mainGroupID + ' "First group"',
	// 	'cen ' + mainGroupID + ' ' + firstEntryID,
	// 	'sep ' + firstEntryID + ' title "Blog login"',
	// 	'sem ' + firstEntryID + ' "security key" "9924dd--..$#(*&^)&*#^$% ;; !![]\\\"\\\"..."',

	// 	'cgr ' + mainGroupID + ' ' + secondGroupID,
	// 	'tgr ' + secondGroupID + ' "Second group"',
	// 	'cen ' + secondGroupID + ' ' + secondEntryID,
	// 	'sep ' + secondEntryID + ' title "Second entry"',
	// 	'men ' + secondEntryID + ' ' + mainGroupID,

	// 	'cgr ' + secondGroupID + ' ' + thirdGroupID,
	// 	'tgr ' + thirdGroupID + ' "Third group"',
	// 	'mgr ' + thirdGroupID + ' ' + mainGroupID,
	// 	'mgr ' + thirdGroupID + ' ' + '0'
	// ].forEach(function(command) {
	// 	parser.execute(command);
	// });

	// console.log(JSON.stringify(parser._dataset));


	// var library = require("./module.js"),
	// 	Archive = library.Archive,
	// 	FileDatasource = library.FileDatasource,
	// 	WebDAVDatasource = library.WebDAVDatasource,
	// 	OwnCloudDatasource = library.OwnCloudDatasource;

	// var archive = new Archive();
	// var group = archive.createGroup("test");
	// var entry = group.createEntry("Monkey");
	// entry.setProperty("username", "gorilla");
	// entry.setProperty("password", "inDaHou$3");
	// entry.setMeta(" some long a$$ string ", "dasdw3r2nlj4nr3k4nr3kbrabebfiu4aeib a4beliubtie4ut");

	// var group2 = archive.createGroup("test2");
	// var entry2 = group2.createEntry("Toadstool");
	// entry2.setProperty("title", "Toadstool-!");
	// entry2.setProperty("username", "kong");

	// group2.moveToGroup(group);
	// entry.moveToGroup(group2);
	// entry.delete();

	// var datasource = new FileDatasource("/Users/pez/test.bcp");
	// datasource.save(archive, "123 banana");


	// ----

	// archive = null;
	// datasource = null;

	// datasource = new FileDatasource("/Users/pez/test.bcp");
	// datasource.load("123 banana").then(function(archive) {
	// 	console.log(JSON.stringify(archive._getWestley()._dataset));
	// 	console.log("---\n" + archive._getWestley().getHistory().join("\n") + "\n---");
	// });

	// var library = require("./module.js"),
	// 	KeePass2XMLImporter = library.KeePass2XMLImporter;

	// KeePass2XMLImporter.loadFromFile("/Users/pez/perry.test.xml").then(function(importer) {
	// 	importer.exportArchive().then(function(archive) {
	// 		console.log(JSON.stringify(archive._getWestley()._dataset));
	// 		//console.log("---\n" + archive._getWestley().getHistory().join("\n") + "\n---");
	// 	}).catch(function(err) {
	// 		console.error("err", err);
	// 	});
	// }).catch(function(err) {
	// 	console.error("err", err);
	// });

	var library = require("./module.js"),
		PasswordGenerator = library.PasswordGenerator;

	var pg = new PasswordGenerator();
	pg.useCharacterSet(PasswordGenerator.CharacterSet.lowerCaseLetters)
		.useCharacterSet(PasswordGenerator.CharacterSet.upperCaseLetters)
		.useCharacterSet(PasswordGenerator.CharacterSet.dash)
		.useCharacterSet(PasswordGenerator.CharacterSet.underscore)
		.useCharacterSet(PasswordGenerator.CharacterSet.special)
		.useCharacterSet(PasswordGenerator.CharacterSet.numbers);
	console.log("pass:", pg.generatePassword(32));

})();