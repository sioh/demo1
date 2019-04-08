module.exports = function (grunt) {
	"use strict";
	
	// Delete transfered Component-preload.js from previous build.
	if (grunt.file.exists("./webapp/Component-preload.disabled.js")) {
		grunt.file.delete("./webapp/Component-preload.disabled.js");
	}
	
	// Fetching application id.
	if (grunt.file.exists("./webapp/config.json")) {
		grunt.option("sAppName",  grunt.file.readJSON("./webapp/config.json").ApplicationID);
	} else {
		grunt.log.writeln("No config.json file found in directory 'webapp'.");
	}
	
	// Fetching application version and OData path.
	if (grunt.file.exists("./webapp/manifest.json")) {
		var sManifest = grunt.file.readJSON("./webapp/manifest.json"),
			sDsn = sManifest["sap.ui5"].models[""].dataSource;
		grunt.option("sDsnUri", sManifest["sap.app"].dataSources[sDsn.toString()].uri);
		grunt.option("sAppVersion", grunt.file.readJSON("./webapp/manifest.json")["sap.app"].applicationVersion.version);
	} else {
		grunt.log.writeln("No manifest.json file found in directory 'webapp'.");
	}
	
	// Reading template of README file to be included in JSDoc.
	if (grunt.file.exists("./README.template")) {
		grunt.option("sReadmeFileContent", grunt.file.read("./README.template").toString());
	} else {
		grunt.log.writeln("No README.template file found in directory 'webapp'.");
	}
	
	// Load and configure the original SAP build strap.
	grunt.loadNpmTasks("@sap/grunt-sapui5-bestpractice-build");
	grunt.config.merge({
		compatVersion: "edge"
	});
	
	// Load and configure the JSDoc task.
	grunt.loadNpmTasks("grunt-jsdoc");
	grunt.config("jsdoc", {
        src: ["./webapp/*.js", "./webapp/controller/*.js", "README.MD"],
        options: {
            destination: "./dist/docs-" + grunt.option("sAppName") + "-" + grunt.option("sAppVersion"),
            private: true
      }
	});
	
	// Creating the README file to be included in JSDoc.
	grunt.registerTask("jsdoc-preprocess", "Generate 'README.MD'", function() {
		grunt.file.write("./README.MD", grunt.option("sReadmeFileContent")
			.replace("$APPNAME", grunt.option("sAppName"))
			.replace("$VERSION", grunt.option("sAppVersion"))
			.replace("$ODATAURI", grunt.option("sDsnUri")));
		grunt.log.writeln("README.MD created.");
	});
	
	// Bannering the created Component-preload.js and transfering the result to the webapp folder.
	grunt.registerTask("copy-cp", "Copy generated 'Component-preload.js' to webapp folder", function() {
		var sBannerText = "/*\n *\tApp:\t\t" + grunt.option("sAppName") 
						+ "\n *\tVersion:\t" + grunt.option("sAppVersion") 
						+ "\n *\tAll Rights reserved by BRUNATA MUENCHEN\n" + " */\n",
			sComponentPreload = grunt.file.read("./dist/Component-preload.js").toString();
		grunt.file.write("./webapp/Component-preload.disabled.js", sBannerText + sComponentPreload);
		grunt.log.writeln("Component-preload.disabled.js bannered and transfered.");
	});
	
	// Defining the tasks in order to perform.
	grunt.registerTask("default", [
		"clean",
		"lint",
		"build",
		"jsdoc-preprocess",
		"jsdoc",
		"copy-cp"
	]);
};