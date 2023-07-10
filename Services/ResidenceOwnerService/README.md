Create a folder with the name of the service

create a package.json file and past this to use as core packages:

````{
  "name": "residenceownerservice",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.4.1",
    "typescript": "^5.1.6"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.5.0"
  }
}

````

add a "dist" folder and an "index.ts" file

add a "tsconfig.json" file and paste this:

````
{
  "compilerOptions": {
    "target": "es2018",
    "lib": ["es5", "es6", "ES2021.String", "ES2018"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowJs": true,
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "strictPropertyInitialization": false,
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"],
  "ts-node": {
    "files": true
  }
}

````
