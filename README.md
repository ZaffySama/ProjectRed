# ProjectRed
Proyecto creado usando React.JS, Node.JS y Apollo GraphQL  Como iniciar el proyecto::  Instalar NodeJS y NPM Instalar MySQL npm install -g sequelize-cli (version 6.2) Instanlar node-sass 4.14.1 (npm uninstall node-sass &amp;&amp; npm install node-sass@4.14.1) npm rebuild node-sass config - config.json - cambiar development para que la base de datos coincida con la tuya si es necesario (root - root y prj_red por defecto) migrar la base de datos con sequelize : sequelize db:migrate (fotos de la base de datos en la carpeta imagenes DB en caso de que no funcione, para recrear manualmente) npm install apollo-server graphql  Para iniciar el servidor :  En la carpeta general ejecutamos npm run dev Hacemos "cd cliente" y ejecutamos npm start  Esto empezara nuestro servidor de apollo y react (front y back)
