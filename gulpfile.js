const gulp = require('gulp');
const nodemon = require('nodemon');
const exec  = require('child_process').exec;

gulp.task('start', function (cb) {
    exec('npm run serve', {
        cwd: 'Views/userClient/',
    }, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

    exec('npm start >> logs/log-$(date "+%Y.%m.%d-%H.%M.%S").log', {
        cwd: 'Services/UsersService/',
    }, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

    exec('npm start >> logs/log-$(date "+%Y.%m.%d-%H.%M.%S").log', {
        cwd: 'Services/ReviewsService/',
    },function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

    exec('npm run dev', {
        cwd: 'Views/Admin/root/rentify-admin/',
    }, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

    exec('npm start', {
        cwd: 'Views/MapsView/app/',
    }, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})

gulp.task('build', async function (done) {

    exec('npm install', {
        cwd: 'Views/Admin/root/rentify-admin/'
    }, (error, stdout, stderr) => {
        let logmessage = stdout + "\nRentify-Admin PACKAGES INSTALLED SUCCESSFULLY" + "\n\n---------------------------------\n";
        console.log(logmessage)
        if (stderr) console.log("Error instaling packages for rentify-admin")
    });

    /* @deprecated
    exec('npm install', {
        cwd: 'Database/'
    }, (error, stdout, stderr) => {
        let logmessage = stdout + "\nDATABASE PACKAGES INSTALLED SUCCESSFULLY" + "\n\n---------------------------------\n";
        console.log(logmessage)
        if (stderr) console.log("Error instaling packages for Database")
    });*/

    exec('npm install', {
        cwd: 'Views/MapsView/app/'
    }, (error, stdout, stderr) => {
        let logmessage = stdout + "\nMAPS_VIEW PACKAGES INSTALLED SUCCESSFULLY" + "\n\n---------------------------------\n";
        console.log(logmessage)
        if (stderr) console.log("Error instaling packages for MapsView")
    });

    exec('npm install', {
        cwd: 'Services/ReviewsService/'
    }, (error, stdout, stderr) => {
        let logmessage = stdout + "\nREVIEW_SERVICE PACKAGES INSTALLED SUCCESSFULLY" + "\n\n---------------------------------\n";
        console.log(logmessage)
        if (stderr) console.log("Error instaling packages for ReviewsService")
    });

    exec('npm install', {
        cwd: 'Services/UsersService/'
    }, (error, stdout, stderr) => {
        let logmessage = stdout + "\nUsers_Service PACKAGES INSTALLED SUCCESSFULLY" + "\n\n---------------------------------\n";
        console.log(logmessage)
        if (stderr) console.log("Error instaling packages for UsersService")
    });

    exec('npm install', {
        cwd: 'Views/userclient/'
    }, (error, stdout, stderr) => {
        let logmessage = stdout + "\nUsers_Client PACKAGES INSTALLED SUCCESSFULLY" + "\n\n---------------------------------\n";
        console.log(logmessage)
        if (stderr) console.log("Error instaling packages for userclient")
    });

    exec('npm install', {
        cwd: 'Services/UsersService/database/'
    }, (error, stdout, stderr) => {
        let logmessage = stdout + "\nUsers database PACKAGES INSTALLED SUCCESSFULLY" + "\n\n---------------------------------\n";
        console.log(logmessage)
        if (stderr) console.log("Error instaling packages for users database")
    });
})
