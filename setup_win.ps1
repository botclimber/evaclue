# Prompt for root DB user and password
$rootUser = Read-Host -Prompt "Enter the root DB user"
$rootPassword = Read-Host -Prompt "Enter the root DB password" -AsSecureString
$rootPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootPassword))

# Function to create a directory if it doesn't exist
function CreateDirectoryIfNotExists($path) {
    if (-not (Test-Path $path -PathType Container)) {
        New-Item -Path $path -ItemType Directory -Force | Out-Null
    }
}

# Clear the console
Clear-Host

# Display Evaclue Setup Configuration
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor red
Write-Host "║     EVACLUE - Setup Wizard v0.2      ║" -ForegroundColor red
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor red
Write-Host

# Prompt for MySQL database setup
Write-Host "MySQL Database Setup" -ForegroundColor Yellow
Write-Host "-------------------" -ForegroundColor Yellow
Write-Host
$mysqlSetup = @{
    "DB_HOST"     = "localhost"
    "DB_USER"     = $rootUser
    "DB_PASSWORD" = "$rootPassword"
    "DB_NAME"     = "evaclue_db"
}
$mysqlSetup.GetEnumerator() | ForEach-Object {
    $key = $_.Key
    $value = $_.Value
    Write-Host "$key = $value"
}
Write-Host

# Go to the Database folder
Set-Location -Path ".\Database"

# Make connection to the MySQL database
mysql -u $rootUser -p"$rootPassword" -e "source evaclue_db.sql"

# Go back to the Root directory
Set-Location -Path ".."

# Prompt for logs folders
Write-Host
Write-Host "Logs Folders Setup" -ForegroundColor Yellow
Write-Host "------------------" -ForegroundColor Yellow
Write-Host
$logsPath = @(
    ".\Services\NotificationService\logs",
    ".\Services\ReviewsService\logs",
    ".\Services\UsersService\logs"
)
foreach ($path in $logsPath) {
    CreateDirectoryIfNotExists $path
    Write-Host "Created logs folder: $path"
}
Write-Host

# System Config Setup Prompt
Write-Host "System Config Setup" -ForegroundColor Yellow
Write-Host "-------------------" -ForegroundColor Yellow
Write-Host

$code = @"
const notPort = 8002
const landPort = 80
const revPort = 8000
const userPort = 8001

module.exports = {
    apps : [
        {
            name   : "NotService",
            script : "./Services/NotificationService/index.js",
            env: {
                "PORT": notPort,
                "SMTP_EMAIL": "supp.evaclue@gmail.com",
                "SMTP_HOST": "smtp.gmail.com",
                "SMTP_PORT": 587,
                "SMTP_USER": "supp.evaclue@gmail.com",
                "SMTP_PASS": "drqohvkkewrkrnjt"
            }
        },
        {
            name   : "RevServices",
            script: "./Services/ReviewsService/index.js",
            watch: true,
            env: {
                "PORT": revPort,
                "DB_HOST": "localhost",
                "DB_USER": $rootUser,
                "DB_PASSWORD": "$rootPassword",
                "DB_NAME": "evaclue_db",
                "APIKEY": "AIzaSyBq2YyQh70n_M6glKgr3U4a9vCmY5LU0xQ",
                "SECRET": "greedisgood",
                "DIRNAME": "./Views/Admin/root/rentify-admin/src/assets/images/resProofFiles"
            }
        },
        {
            name: "UsersService",
            script: "./Services/UsersService/dist/src/server.js",
            watch: true,
            env: {
                "SERVER_PORT": userPort,
                "DB_HOST": "localhost",
                "DB_USER": $rootUser,
                "DB_PASSWORD": "$rootPassword",
                "DB_NAME": "evaclue_db",
                "JWT_SECRET": "greedisgood",
                "DIRNAME": "./Views/MapsView/app/src/images/userImages"
            }
        },

        {
            name   : "landPage",
            script : "./Views/evaclue-landingPage/index.js",
            env: {
                "PORT": landPort,
                "not_PORT": notPort,
                "rev_PORT": revPort,
                "user_PORT": userPort
            }
        },

        {
            name   : "MainPlatform",
            cwd    : "./Views/MapsView/app",
            script : "npm",
            args   : "start"
        },

        {
            name   : "authPage",
            cwd    : "./Views/userclient",
            script : "npm",
            args   : "run serve"
        },

        {
            name   : "AdminPlatform",
            cwd    : "./Views/Admin/root/rentify-admin",
            script : "npm",
            args   : "run dev"
        },
    ]
}
"@

$filePath = Join-Path -Path $PSScriptRoot -ChildPath "system.config.js"
$code | Out-File -FilePath $filePath
Write-Host "system.config.js file created successfully at: $filePath"
Write-Host

# Project dependencies installation
Write-Host "Project Dependencies Installation" -ForegroundColor Yellow
Write-Host "-------------------" -ForegroundColor Yellow
Write-Host

# Install gulp globally
Write-Host "Installing gulp globally..." -ForegroundColor Cyan
Write-Host
npm install --global gulp-cli

# Install project dependencies
Write-Host
Write-Host "Installing project dependencies..." -ForegroundColor Cyan
npm install

# Build the application
Write-Host
Write-Host "Building the application..." -ForegroundColor Cyan
Write-Host
gulp build

# Install PM2 Process Manager
Write-Host "Installing PM2..." -ForegroundColor Cyan
Write-Host
npm install pm2 -g

Write-Host
Write-Host
Write-Host "Setup configuration completed successfully!" -ForegroundColor Green
Write-Host

# Start the project
#Write-Host "Starting..." -ForegroundColor Cyan
#pm2 start system.config.json