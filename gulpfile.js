/**
 * When starting if some service fails it kills all other instances, currently only works for nodejs services.
 */

const gulp = require('gulp');
const exec  = require('child_process').exec;

// Services
const notService = "NotificationService"
const revService = "ReviewsService"
const userService = "UsersService"

gulp.task('start', function (cb) {
    exec('npm run serve', {
        cwd: 'Views/userClient/',
    }, function (err, stdout, stderr) {
        if(err) exec("killall node")
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

    exec('npm start >> logs/log-$(date "+%Y.%m.%d-%H.%M.%S").log', {
        cwd: `Services/${userService}/`,
    }, function (err, stdout, stderr) {
        if(err) exec("killall node")
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

    exec('npm start >> logs/log-$(date "+%Y.%m.%d-%H.%M.%S").log', {
        cwd: `Services/${revService}/`,
    },function (err, stdout, stderr) {
        if(err) exec("killall node")
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

    exec('npm run compile && npm start >> logs/log-$(date "+%Y.%m.%d-%H.%M.%S").log', {
        cwd: `Services/${notService}/`,
    },function (err, stdout, stderr) {
        if(err) exec("killall node")
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

    exec('npm run dev', {
        cwd: 'Views/Admin/root/rentify-admin/',
    }, function (err, stdout, stderr) {
        if(err) exec("killall node")
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

    exec('npm start', {
        cwd: 'Views/MapsView/app/',
    }, function (err, stdout, stderr) {
        if(err) exec("killall node")
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
        cwd: `Services/${revService}/`,
    }, (error, stdout, stderr) => {
        let logmessage = stdout + `\n${revService} PACKAGES INSTALLED SUCCESSFULLY` + `\n\n---------------------------------\n`;
        console.log(logmessage)
        if (stderr) console.log(`Error instaling packages for ${revService}`)
    });

    exec('npm install', {
        cwd: `Services/${notService}/`
    }, (error, stdout, stderr) => {
        let logmessage = stdout + `\n${notService} PACKAGES INSTALLED SUCCESSFULLY` + `\n\n---------------------------------\n`;
        console.log(logmessage)
        if (stderr) console.log(`Error instaling packages for ${notService}`)
    });

    exec('npm install', {
        cwd: `Services/${userService}/`
    }, (error, stdout, stderr) => {
        let logmessage = stdout + `\n${userService} PACKAGES INSTALLED SUCCESSFULLY` + `\n\n---------------------------------\n`;
        console.log(logmessage)
        if (stderr) console.log(`Error instaling packages for ${userService}`)
    });

    exec('npm install', {   
        cwd: 'Views/userclient/'
    }, (error, stdout, stderr) => {
        let logmessage = stdout + "\nUsers_Client PACKAGES INSTALLED SUCCESSFULLY" + "\n\n---------------------------------\n";
        console.log(logmessage)
        if (stderr) console.log("Error instaling packages for userclient")
    });
})