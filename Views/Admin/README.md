# How to deploy the productive version

Run:
- ```npm run build```

then go to the dist/index_prod.html file and do the following steps:
- rename it to index.html
- change:
    - <script type="module" crossorigin src="/assets/main-1720177d.js"></script> to <script type="text/javascript" src="assets/main-1720177d.js"></script>

After these steps, just opening the dist/index.html file should be sufficient. (Make sure services are running)
