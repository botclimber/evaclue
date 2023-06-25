module.exports = {
    apps : [
        {
        name   : "NotService",
        script : "./Services/NotificationService/index.js",
        env: {
            "PORT": 8002, 
            "SMTP_EMAIL": "supp.evaclue@gmail.com",
            "SMTP_HOST": "smtp.gmail.com",
            "SMTP_PORT": 587,
            "SMTP_USER": "supp.evaclue@gmail.com",
            "SMTP_PASS": "drqohvkkewrkrnjt"
        }
        },

        {
            name   : "landPage",
            script : "./Views/evaclue-landingPage/index.js",
            env: {
                "PORT": 80, 
            }
            },
    ]
}