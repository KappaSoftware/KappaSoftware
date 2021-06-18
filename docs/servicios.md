# Arquitectura de Servicios

Este documento describe el diseño funcional de la infraetructura de servicios de KappaSoftware.

El diseño general comprende los siguientes componentes:

- **Node.js**: también llamado "backend", es el núcleo de funcionamiento del sistema. Este componente es el encargado de obtener y enrutar la información que necesita todo el sistema.
- **React**: también llamado "frontend", es el componente encargado de construir la interfaz gráfica de usuario, principalmente la interfaz web.
- **LeafLet**: librería desarrollada en JavaScript con las funciones relacionadas con la localización geográfica y la construcción de mapas.
- **MongoDB**: servicio de Base de Datos en el cual se almacena toda la información persistente del servicio.
- **Telegram-bot**: Componente de interoperabilidad con la red social Telegram.
- **DNS**: servicio de resolución de nombres para abstraer las rutas de acceso entre los host donde se encuentran los componentes y en algunos casos puede proveer balanceo de carga.

Junto a los componentes anteriores, se añaden los siguientes servicios externos con los cuales se vincula el sistema para extender sus funcionalidades:

- **Telegram**: Red social de mensajería instantánea, usada por KappaSoftware para la interacción con clientes que pueden desde su interfaz consultar y añadir registros.
- **OpenStreetMap**: Servicio de Mapas y localización geográfica con API pública y posibilidad de hacer implementaciones locales, privadas y parciales del servicio.

En la siguiente imagen se pueden observar estos elementos y la forma en la que interoperan:

![Diseño General de Servicios](https://github.com/KappaSoftware/Kappa/blob/main/imagenes/doc/dise%C3%B1o-de-servicios.png)

El diseño propuesto permite ajustar la capacidad de cómputo y respuesta en función de la demanda desde los clientes de cada servicio, de manera de proveer balanceo de carga y alta disponibilidad, a su vez permitiendo la escalabilidad del sistema ante el aumento de peticiones externas e internas. La siguiente imagen ilustra el esquema de funcionamiento de esta escalabilidad:

![Diseño de Nube](https://user-images.githubusercontent.com/37819159/108674321-7bd20580-74bb-11eb-860e-9e1b73b398d2.png)

Estas partes que comprenden el funcionamiento de KappaSoftware tienen formas distintas de implementarse para permitir escalabilidad, balanceo de carga y tolerancia a fallos:

- Los componentes que se comunican mediante el protocolo HTTP(s) estarán dispuestos dentro de máquinas virtuales (KVM) o contenedores (Docker) a las cuales se acceden a través de proxys reversos (Nginx o Apache) que fungen a su vez como directores para el balanceo de carga.
- La Base de Datos (MongoDB) usa el esquema propio sugerido por la documentación oficial de ese servicio para proveer las funciones de LB/HA.
- El Bot de Telegram usa un esquema de cluster Activo-Pasivo para proveer estas funciones, ya que el lenguaje escogido (Python3) y la librería con la cual interopera con la API de esta red social no comprende ni permite paralelizar su funcionamiento.

A continuación se describe en detalle el esquema de funcionamiento para LB/HA de cada uno de los componentes:

## Base de Datos (MongoDB)

Vínculo a la Documentación Oficial donde se describe el funcionamiento de este servicio en cluster: https://docs.mongodb.com/manual/tutorial/deploy-shard-cluster/

MongoDB funciona en cluster mediante la creación de instancias "mongos" e instancias "mongod", los cuales son los componentes de la Base de Datos que proveen los servicios de enrutamiento (directores del cluster), servicios de configuración (autenticación y parámetros de funcionamiento del cluster) y réplicas (instancias con copias exactas de la data almacenada).

En la siguiente imagen (tomada de https://github.com/minhhungit/mongodb-cluster-docker-compose) se puede observar el esquema de funcionamiento de MongoDB en una implementación en cluster:

![MongoDB Cluster](https://raw.githubusercontent.com/minhhungit/mongodb-cluster-docker-compose/master/images/sharding-and-replica-sets.png)

Sumado al diseño anterior, hay que añadir los esquemas de seguridad y control de acceso a los clientes del servicio. Para esto se definen *Roles de Autorización* (ver https://docs.mongodb.com/manual/core/authorization/) o alternativamente se configura un mecanismo de *Autenticación Interna* (ver https://docs.mongodb.com/manual/core/security-internal-authentication/). Para el momento de redacción de este documento aún es necesario evaluar cuál de los dos métodos es el mas indicado o si ambos deben ser implementados en función de las necesidades de cada componente dentro del diseño final del sistema.

En el siguiente vínculo se describe en detalle una receta de implementación usando el esquema anteriormente descrito: https://github.com/minhhungit/mongodb-cluster-docker-compose

## NodeJS: Backend y Frontend

El funcionamiento por defecto que provee NodeJS para paralelizar procesos, en principio, se realiza usando un solo proceso en un solo host. Para añdir subprocesos en el mismo host que puedan atender simultáneamente peticiones en paralelo, define un proceso "maestro" y explícitamente en el código se deben definir una serie de "workers" o procesos secundarios, lo cual requiere realizar estáticamente sentencias "if-else" dentro del código fuente de la aplicación, según se indica en la documentación oficial: https://nodejs.org/api/cluster.html 

Alternativamente, existe el desarrollo de un daemon PM2 que hace posible crear procesos secundarios transparentemente (ver https://pm2.keymetrics.io/docs/usage/quick-start/)

En ambos casos (usando la clusterización en el código o mediante el daemon PM2), se tiene un esquema de funcionamiento como el que se ilustra en la siguiente imagen, para cada nodo de backend o frontend (tomado de https://medium.com/iquii/good-practices-for-high-performance-and-scalable-node-js-applications-part-1-3-bb06b6204197):

![NodeJS Cluster](https://miro.medium.com/max/590/1*p6YEK7y6JsVYBaZkhu4UbQ.png)

Cualquiera sea el modo en el cual se atiendan peticiones en paralelo en un host, para crear un cluster de nodos de NodeJS se recomienda el uso de un Proxy Reverso (implementado con Apache o Nginx), el cual se coloca ante los clientes (interno o externos, dependiendo del componente requerido) para atender las peticiones y como director del cluster este servicio administra en el esquema de balanceo de carga escogido (roundrobin, por disponibilidad de respuesta, etc) y enruta las conexiones hacia un nodo y este a su vez al subproceso correspondiente:

![NodeJS Horizontral](https://miro.medium.com/max/796/1*ryiL00dESNJTL_jRnUyAyA.png)


## Clusterización del Bot de Telegram

El desarrollo del bot de telegram usa Python3 como lenguaje de programación y la librería (https://github.com/python-telegram-bot/python-telegram-bot) la cual contiene las funciones para la integración con la API de Telegram. Esto condiciona especialmente el diseño de funcionamiento para trabajar en cluster, ya que explícitamente se restringe la ejecución simultánea de mas de una instancia vinculada a la API de esta red social (ver https://telegram.org/faq#p-puedo-ejecutar-telegram-usando-mi-propio-servidor).

Asimismo, la clusterización de instancias de un proceso en distintos hosts no es una funcionalidad propia del lenguaje de programación Python (tanto en las versiones 2.x y 3.x) de manera que se requiere un desarrollo adicional que se coloque sobre este servicio para poderlo sindicar dentro una estructura de cluster.

Por estas razones, la solución propuesta resuelve la alta disponibilidad, pero no contempla el balanceo de carga:

Se creará un esquema de cluster activo-pasivo usando Pacemaker y Corosync (ver https://wiki.debian.org/Debian-HA/ClustersFromScratch) donde es posible la existencia de múltiples nodos pero restringiendo la ejecución simultánea, de manera que existirá sólo un nodo activo y en caso de alguna falla se llevará a cabo un relevo automático de la instancia que presenta el error, enrutando las peticiones hacia un nuevo nodo activo e inmediatamente activando una acción de STONITH sobre el inactivo.

![Cluster para BOT de Telegram](https://github.com/KappaSoftware/Kappa/blob/main/imagenes/doc/bot-telegram-cluster.png)

El diseño de cluster propuesto para este componente consta de 3 nodos, de manera de poder configurar un diseño que prevenga las situaciones de split-brain, ya que de esta manera se puede asegurar que ningún nodo pueda operar si no ve al menos uno mas activo. Como nota de recordatorio, se necesita diseñar y configurar el método para activar STONITH a las máquinas virtuales o contenedores en los cuales se estén ejecutando nodos que requieran ser desactivados.

## DNS

El diseño para la resolución de nombres no presenta mayor diferencia con el propio que contiene el funcionamiento de un servicio DNS: se define una zona de autoridad, con 2 o mas nodos entre los cuales se realiza una transferencia de zona del dominio donde se asignan los hosts.

La única característica a añadir es la posible definición de punteros "srv" que eventualmente puedan asignar respuestas en "round robin" sobre los servicios que puedan responder de manera indistinta a los clientes, como es el caso de las instancias HTTP (backend y frontend) que se definen en la sección anterior correspondiente. Esto es necesario que sea evaluado, pues el módulo de proxy reverso que brinda Apache y Nginx ya contiene esta funcionalidad y es posible que no sea recomendable o necesario redundar la alternabilidad.

# Recetas de Instalación

En esta sección se especifican los pasos a seguir para instalar, configurar e implementar los servicios enumerados en este documento, con el diseño de alta disponibilidad y balanceo de carga para cada caso.

Se usará el Sistema Operativo GNU/Linux para cada host donde se instancie algún componente de los servicios propios de Kappa. En específico la distribución Debian, versión 10 (nombre código "Buster"), por ser la versión estable para el momento de realizar esta implementación.

## MongoDB

La documentación oficial de MongoDB (ver https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/) recomienda no usar la versión instalables desde el administrador de paquetes de la distribución, sino en cambio usar los publicados en el repositorio de los desarrolladores:

```bash

apt update

apt upgrade

apt install gnupg2

wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -

echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list

apt update

apt install -y mongodb-org

```

Para prevenir que en el futuro se actualice la versión estable que se descsarga al momento de realizar la instalación, se recomienda ejecutar:

```bash
echo "mongodb-org hold" | dpkg --set-selections
echo "mongodb-org-server hold" | dpkg --set-selections
echo "mongodb-org-shell hold" | dpkg --set-selections
echo "mongodb-org-mongos hold" | dpkg --set-selections
echo "mongodb-org-tools hold" | dpkg --set-selections
```

Luego se inicia el servicio y se configura el daemon para que se levante cada vez que el sistema operativo reinicie:

```bash

systemctl start mongod

systemctl status mongod

systemctl enable mongod
```

En la configuración por defecto, el servicio sólo permite conexiones desde localhost, por lo que se requiere modificar el archivo /etc/mongod.conf de tal manera que las líneas relacionadas con networking queden de la siguiente manera:

```bash
net:
  port: 27017
  bindIp: 0.0.0.0
```

Crear Usuario Admin con Password:

```
systemctl stop mongod.service
mongod --port 27017 --dbpath /var/lib/mongodb

# En otra consola:

mongo --port 27017

use admin
db.createUser(
  {
    user: "myUserAdmin",
    pwd: passwordPrompt(), // or cleartext password
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)

Password: <pass>
db.adminCommand( { shutdown: 1 } )
nohup mongod --auth --port 27017 --dbpath /var/lib/mongodb --bind_ip 0.0.0.0 &

Conectarse CLI:

mongo --port 27017  --authenticationDatabase "admin" -u "myUserAdmin" -p
clave: 123

Conexión desde NODE.JS:

mongo mongodb://myUserAdmin:123@192.168.17.103:27017/?authSource=admin
mongo mongodb://myUserAdmin:123@mongo-kappa.gnuve.org:27017/?authSource=admin

```

**NOTA:** esto es un fix inicial, la configuración de control de acceso debe hacerse mediante "Usuarios y Roles":

 * https://docs.mongodb.com/manual/tutorial/enable-authentication/
 * https://docs.mongodb.com/manual/tutorial/manage-users-and-roles/


## NodeJS: Backend + Frontend

Para colocar en producción a Kappa, sólo es necesario descargarse el repositorio en Github y ejecutar los siguientes pasos:

```
git pull
npm install
npm run-script buildFront
npm start
```

**Instrucciones para instalar el Backend en DEBIAN 10 (buster):**

Esta sección es OPCIONAL, se creó con la finalidad de documentar el proceso de creación del ámbito de desarrollo para Kappa:

Instalación de NODE.JS y express-generator
```
su -
apt update
apt instal curl
curl -fsSL https://deb.nodesource.com/setup_12.x | bash -
apt install nodejs
npm install express-generator -g
```

Se instalan las dependencias de express-generator (como usuario regular)
```
express app-test
cd app-test
npm install
```

Configurar NODE para ejecutar nodemon en su lugar

```
su -
npm install -g nodemon

# Como usuario regular se modifica NODEJS

vim package.json
{
  "name": "app-test",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "nodemon ./bin/www"   <---- se cambia "node" por "nodemon"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "jade": "~1.11.0",
    "morgan": "~1.9.1"
  }
}

# También como usuario regular se cambia el puerto de NODEJS para que responda en uno distinto al FRONTEND:

vim bin/www

var port = normalizePort(process.env.PORT || '3001');
```

Probamos la instalación de NODE:
```
$ npm start

$ firefox http://localhost:3001

# CONTROL-C para salir
```

Se instala el FRONTEND (REACT) en la ruta "front-test". Esto se realiza como usuario regular para que sea una librería local:
```
 npx create-react-app front-test
```

Para probar se levanta el servicio del FRONTEND
```
cd front-test
npm start

# CONTROL-C para salir

```

Creamos el ambiente de producción, así el FRONTEND serán páginas estáticas:
```
npm run build
```

Configuramos el FRONTEND para reenviar todas la peticiones al BACKEND:
```
cd ..
vim app.js

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'front-test/build')));

cd front-test
vim package.json
  "proxy": "http://localhost:3001",

```

## Desarrollo del BOT de Telegram

Como dicho antes, el BOT de Telegram es desarrollado completamente en Python3. Para contribuir con el desarrollo de esta instancia del proyecto, el código debe ser clonado de nuestro perfil en GitHub, el cual está disponible a través de este enlace: https://github.com/KappaSoftware/ktelegrambot.

Nota que en el código de nuestro repositório no aparece el token del robot de Kappa Software, al cual sólo tienen acceso los desarrolladores iniciales. Para contribuir con nuevas funcionalidades en el Bot, o corregir parte de las existentes, se debe crear un nuevo token para hacer las respectivas pruebas. Ese token debe substituirse por 'YOUR_TOKEN_HERE' en el Updater del código. Crear un token implica crear un robot de Telegram. Un conjunto completo de instrucciones para hacer esto puede encontrarse en https://core.telegram.org/bots. Un resumen de los pasos a seguir para la creación de un bot de Telegram son:

- En tu cuenta de telegram, busca el usuario BotFather
- Envia /newbot como mensaje para indicar que estás solicitando la creación de un nuevo usuario de tipo bot
- Sigue las instrucciones de BotFather en las que se te indica dar un nombre y un nombre de usuario 
- El BotFather creará un token exclusivo para tu bot de test
- En cualquier momento puedes enviar un /help para conocer las diferentes funcionalidades a las que tienes acceso a través del BotFather

Los pasos para la instalación de Python3 dependen del SO en el cual este se quiere instalar. La instalación de Python3 y librerías es recomendada usando un ambiente virtual como "venv" o "anaconda", este último cual ofrece un ambiente virtual y un gestor de paquetes a la vez. 

Para leer más sobre ambientes virtuales e instalación de paquetes puede verse la documentación disponible en https://docs.python.org/3/tutorial/venv.html y https://docs.python.org/3/installing/index.html.

### Requerimientos

Para contribuir al desarrollo de esta herramienta deben instalarse las librerias "python_telegram-bot" y "folium". Las instrucciones de instalación de estas librerias se describen brevemente a seguir.

- La libreria "python_telegram-bot" puede ser instalada ejecutanto en el terminal el comando:
```
$ pip install python-telegram-bot --upgrade
```
o, con anaconda:
```
$ conda install -c conda-forge python-telegram-bot
```
Más información sobre la instalación y uso de esta librería pueden encontrarse en la página fuente: https://github.com/python-telegram-bot/python-telegram-bot

- La libreria Folium, que es necesária para crear el mapa que se muestra en la opción "Búsqueda" del bot, puede instalarse ejecutando el comando
```
$ pip install folium
```
o, con anaconda:
```
$ conda install -c conda-forge folium
```
Más información sobre esta libreria puede encontrarse en https://pypi.org/project/folium/.

El bot de Telegram de Kappa Software cuenta con un filtro de lenguage inapropiado en lenguas inglesa y española, el cual es implementado a través de la función  "bad_language_filter". Para esto fueron utilizadas listas de malas palabras disponibles en https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/blob/master/README.md (Creative Commons Attribution 4.0 International).

## DNS

Actualmente sólo se usa una dirección IP para resolver todos los registros DNS (190.94.243.13) pero es posible y transparente asignar distintas direcciones a los subdominios creados.

Los registros para la resolución de nombres de Kappa son los siguientes:

kappa.gnuve.org 		registro principal
kappafront.gnuve.org 	frontend
kappaback.gnuve.org 	backend
kappadb.gnuve.org 		base de datos


