# How to deploy the productive version
 
Run:
- ``` npm run build ```

then replace what's inside the dist/index.html with: 
    ```
    <!doctype html><html><head><meta http-equiv="refresh" content="0; url=./home.html" /><meta charset="utf-8"><title>Production</title><meta name="viewport" content="width=device-width,initial-scale=1"><script defer="defer" src="app.bundle.js"></script></head><body></body></html>
    ```

- only app.js is being generated with the name of app.bundle.js, any other change in dev mode needs to be reflected in the dist files.
