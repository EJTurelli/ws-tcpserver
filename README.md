# ws-tcpserver

*Este proyecto es una prueba de concepto para interactuar con un servidor TCP a través de un web service.*

## Instalación
```
npm install
```

## Ejecución
En una consola debemos ejecutar el server TCP 
```
# node .\server\server.js
```

Si todo está funcionando bien veremos lo siguiente en la pantalla:
```
Server is listening in port 2222!
```

En otra consola debemos ejecutar el cliente
```
# node .\client\client.js
```

De la misma manera, si todo está funcionando bien veremos lo siguiente en la pantalla:
```
Listening at http://localhost:3000
```

Luego podemos probar el funcionamiento ejecutando
```
# test.bat 1234
```

Y en la pantalla de la consola donde ejecutamos client veremos que aparece lo siguiente
```
Connected to server!
Data sent to server: Client.req_1234 -> 1648158672067 -> Server
Data receive from server: Server -> 1648158672067 -> Client.req_1234
Disconnected from server
```

Y en la pantalla del server
```
Number of concurrent connections to the server : 1
Data receive from client: Client.req_1234 -> 1648158672067 -> Server
Data sent to client: Server -> 1648158672067 -> Client.req_1234
Socket ended from other end!
Socket closed!
```

Por último, en la carpeta ```out``` deberemos encontrar un archivo ```1234.txt``` con el siguiente contenido:
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 65
ETag: W/"41-ZXV5l31aBWbg+Nq6fVuupBFpp3M"
Date: Thu, 24 Mar 2022 21:51:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"data":"Server -> 1648158672067 -> Client.req_1234","time":1568}
```
Donde podemos observar el requerimiento respondido por el server, observar que se diferencia del enviado desde el cliente, y que el mismo corresponde al generado en el llamado al web service ya que el req_id es el mismo.

Para corroborar el funcionamiento con llamados concurrentes podemos ejecutar ```test_concurrency.bat``` y luego verificar cada uno de los archivos generados en ```out```


## Descripción de cada archivo del proyecto

### Archivo ./client/client.js
El módulo principal del sistema es ```./client/client.js```, aquí es donde se levanta el web service y donde generaremos la conexión como cliente hacia el server TCP mediante sockets. 

Este módulo está esperando un request de la siguiente manera:
```
http://localhost:3000/req_id
```
Donde ```req_id``` identifica cada requerimiento que se haga al server, esto es sólo a los fines de verificar el buen funcionamiento del sistema.

El mensaje que se envía al server se genera automáticamente y tiene el siguiente formato:
```
Client.req_[req_id] -> [Date.now()] -> Server

Ej: Client.req_1 -> 1648156370470 -> Server
```
De esta manera podemos ver que los mensajes varían y podremos identificar si las respuestas corresponden con los requerimientos.

El server de prueba recibe el mensaje enviado, lo modifica, demora un momento y lo devuelve:
```
Ej: Server -> 1648156370470 -> Client.req_1
```

El web service retorna entonces lo que el cliente TCP ha recibido, de la siguiente manera:
```
{"data":"Server -> 1648156370470 -> Client.req_1","time":1562}
```
Retornando en la variable ```data``` el mensaje recibido desde el server y en ```time``` el tiempo que demoró entre que se envió el requerimiento al server y obtuvimos la respuesta. *(no olvidar que el server genera una demora para poder observar el funcionamiento concurrente de forma más simple)*

Si se produce algún error en la comunicación entre server TCP y cliente, el web service retornará un json con el siguiente formato:
```
{"error":"mensaje que describe el error"}

Ej: {"error":"Error: connect ECONNREFUSED 127.0.0.1:2222"}
```

### Archivo ./server/server.js
El módulo ```./server/server.js```, es el servidor TCP de test que se encuentra escuchando llamadas de clientes, y cuando uno de ellos le envía un mensaje, lo modifica y lo retorna. Este server está basado integramente en https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10

### Archivo test.bat [en linux test.sh]
La función de este batch es llamar al web service para poder probar el sistema (utilizamos **curl**), se debe ejecutar de la siguiente manera:
```
# test.bat req_id

Ej: test.bat 1234
```
Donde ```req_id``` identifica al requerimiento. La salida de la ejecución de **curl** se encontrará en la carpeta ```out``` en un archivo con extensión 'txt' cuyo nombre es el mismo ```req_id```.

### Archivo test_concurrency.bat [en linux test_concurrency.sh]
La función de este batch es llamar a test.bat [test.sh] diez veces en paralelo con ```req_id``` diferentes, con el fin de probar el funcionamiento del sistema con llamadas concurrentes.




