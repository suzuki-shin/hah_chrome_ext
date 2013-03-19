var fs = require('fs');
var c = require('../ext/config');
var exec = require('child_process').exec;

// abort when DEBUG_MODE is on
if (c.is_debug_mode()) {
    console.log('DEBUG_MODE is on');
    return;
}

var manifest = JSON.parse(fs.readFileSync('ext/manifest.json'));
var package_path = "package/hah_chrome_ext-" + manifest.version + ".zip";

// abort if this version zip file exists
if (fs.existsSync(package_path)) {
    console.log(package_path + " is already exists.");
    return;
}

// packaging
exec("zip " + package_path + " ext/manifest.json ext/*.js ext/*.html ext/*.css",
     function(err, stdout, stderr) {
         if (err !== null) {
             console.log('stderr: ' + stderr);
             console.log('############');
             console.log('exec err: ' + err);
         } else {
             console.log('stdout: ' + stdout);
             console.log('------------');
             console.log('packaging done');
         }
     });
