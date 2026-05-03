
<div align=center>

  <img src="docs/logo.png" name="exemple" style="width:80px; height:80px;">
  
</div>

<h1 align=center>Hello ID OAuth Service</h1>
<div align=center>


<br>
<b>HellOAuth</b> es una librería de autenticación ligera para aplicaciones web, diseñado para proporcionar flujos de inicio de sesión OAuth seguros, <br> autenticación mediante ventanas emergentes, integración basada en eventos e intercambio asíncrono de tokens <br> con una implementación simple y amigable para desarrolladores.<br><br>

Este proyecto ha sido desarrollado por <a href="https://instagram.com/salinxlg">Roger Salinas</a>.<br>
<b>HellOAuth es compatible con Windows, Linux, MacOs</b>

<br>

</div>

 

## Inicio Rápido
Descarga de los archivos
```bash
npm install helloauth
```

El repositorio también puede ser clonado y almacenado en el directorio de scripts del proyecto.

<br>

## Estructura y distribución del proyecto

A continuación se presenta la estructura general del proyecto

```bash
HellOAuth/
├── assx/
│   ├── com.endpoint.php
│   └── com.manifest.helloid.dexly.json
│
├── docs/
│   ├── logo.png
│   └── sign.svg                        
│
├── dexly.client.helloid.js
├── package.json
└── README.md

```
<br><br>

## Configuración antes de comenzar
Antes de comenzar, se necesitan establecer parametros importantes para que `HellOAuth` pueda intercambiar la información de forma correcta con su aplicación.

Primero, debes rellenar los datos necesarios en el archivo manifest, ubicado en: `/assx/com.manifest.helloid.dexly.json`.

A continuación se presenta un ejemplo de configuración inicial:

```json
{

    "app": {

        "name": "TuApp",
        "version": "1.0",
        "developer": "Tu nombre",
        "packagename": "com.app.empresa",
        "protocol": "https:", //es el sugerido
        "domain": "empresa.com"

    },

    "product":{

        "name": "Hello ID OAuth Services",
        "version": "7.1.4",
        "developer": "Roger Salinas",
        "packagename": "com.dexly.helloid",
        "vendor": "Dexly Studios LLC",
        "useragent": "com.dex.dexagent/7.1.4 (cxi=true; env=production; arch=x64; platform=web; vendor=Dexly LLC)",
        "copyright":"© 2026 Dexly Studios LLC.", 
        "dxa-compilation": "2026042001•2024111601",
        "fingerprint": "CA:F6:84:94:47:2B:30:AB:BB:9D:E3:40:03:8B:A6:DC:2B:B7:AF:9D:71:32:C5:12:A6:1D:36:1D:9B:AC:BD:3D"

    },

    "credentials": {

        "token": "123ABC",
        "expiration": "never",
        "type": "webapp"

    },

    "service": {

        "data": {

            "protocol": "https:",
            "domain": "auth.dexly.space",
            "version": "X8",
            "target": "signin"

        }

    }

}

```

Requisitos de configuración:
Es necesario definir el nombre de la aplicación, versión, desarrollador, nombre de paquete, protocolo, dominio y token.

Los campos product y service no deben ser modificados, ya que su alteración puede provocar un comportamiento inesperado del sistema.

<br>

El archivo `com.endpoint.php` es el encargado de comunicarse con los servidores de HelloID para realizar el intercambio seguro del token de autenticación y obtener la información del usuario autenticado.


En este archivo se almacena el `SecretClient`, utilizado para validar la identidad de la aplicación frente al servidor OAuth.

El archivo ubicado en `/assx/com.endpoint.php` debe ser abierto para configurar el SecretClient.
```php

$data = [
    "secretClient" => "123ABC",
    "token"        => $token
];

```

En caso de no realizar esta configuración, el servidor no podrá completar el proceso de handshake incluso si la autenticación es válida.

<br>

## Conexión con tu proyecto

HellOAuth puede integrarse fácilmente en proyectos web mediante importación directa de la librería, para hacerlo debe importar la librería desde tu archivo de JavaScript de esta forma:

``` javascript

  import { helloid } from './dexly.client.helloid.js';

```

<br>

## Métodos y uso de la librería:

La librería `HelloAuth` expone diferentes métodos para inicializar el servicio, realizar autenticaciones y obtener información de la API.

Todos los métodos se ejecutan desde el objeto `helloid`:

```javascript
helloid.metodo();

```

Actualmente la librería incluye los siguientes métodos:

- `init()` → Inicializa la librería y carga la configuración del servicio.
- `auth()` → Inicia el proceso de autenticación OAuth.
- `getVersion()` → Devuelve información general de la librería y versión instalada.
- `getProcessor()` → Devuelve información interna del motor de autenticación.

<br><br>

## Proceso de autenticación

Antes de utilizar cualquier método de autenticación, debes inicializar la librería utilizando `helloid.init()`.

Cuando la inicialización finaliza correctamente, la librería despacha automáticamente el evento `helloid:ready` al DOM, permitiendo detectar fácilmente cuándo la librería está lista para ser utilizado mediante `addEventListener`.

Ejemplo de implementación:

```javascript

helloid.init();

window.addEventListener('helloid:ready', async function(e){

  const button = document.querySelector('button');

  button.addEventListener('click', loginNow);

  async function loginNow(){

      const helloidlogin = await helloid.auth();
      console.log(helloidlogin);

  }

})


```

### Autenticación

El proceso de autenticación se realiza mediante el método `helloid.auth()`.

Este método abre la ventana de autenticación OAuth y devuelve una promesa con la información de la cuenta autenticada una vez que el proceso finaliza correctamente.

La respuesta puede manejarse utilizando:

- `await`
- `.then()`
- el evento `helloid:success`

A continuación se muestran algunos ejemplos de implementación:

Autenticación con `await`:

```javascript

async function loginNow(){

  const helloidlogin = await helloid.auth();

}

```

<br>

Autenticación con `.then()`:

```javascript

helloid.auth().then(response => {

  console.log(response);

})

```

Autenticación con evento `helloid:success`:

```javascript

window.addEventListener('helloid:success', function(e){

    const data = e.detail;
    const account = data.account;
    const event = data.event;

    console.log(data);
    console.log(account)
    console.log(event)

})

```

Este evento devuelve la información de la cuenta autenticada mediante `e.detail.account`.

También incluye información relacionada con el estado y tipo del evento en `e.detail.event`, retornando un objeto con una estructura similar a la siguiente:

```json

{
  "service": "com.dexly.helloid",
  "event": "login:success",
  "state": 200
}

```


<br><br>

## Manejo de errores

HelloAuth incluye un sistema unificado de manejo de errores compatible con todos los métodos de autenticación disponibles.

Si ocurre un problema durante el proceso de autenticación, la librería generará automáticamente el evento `helloid:error`, el cual contiene información detallada sobre el error ocurrido.

Puedes obtener la información del error utilizando `addEventListener`:

```javascript
window.addEventListener('helloid:error', function(e){

  console.log(e.detail.event);

})

```

El evento retorna un objeto con una estructura similar a la siguiente:

```json
{
  "event": {

    "service": "com.dexly.helloid",
    "event": "login:error",
    "state": "código de error HTTP"

  },

  "state": "código de error HTTP",
  "phase": "(INT) indica en qué fase del handshake ocurrió el error para fines de diagnóstico"

}

```

<br><br>

## Errores comunes

### 1) La autenticación no responde o aparece un error `503` en consola

Este problema ocurre cuando se intenta ejecutar `helloid.auth()` sin haber inicializado previamente la librería mediante `helloid.init()`.

Antes de utilizar cualquier método de autenticación, asegúrate de inicializar correctamente la librería:

```javascript
helloid.init();
```

<br>

### 2) Error `499` en consola

Este error ocurre cuando el usuario cierra manualmente la ventana de autenticación antes de completar el proceso de inicio de sesión.

Generalmente este evento va acompañado de:

```json
{
  "event": "aborted"
}

```

<br>

### 3) Error `500` en consola

Este error ocurre cuando los servidores de HellOAuth no se encuentran disponibles temporalmente para completar el proceso de autenticación o el intercambio de tokens.

Generalmente está relacionado con fallas internas del servicio o tareas de mantenimiento.

<br>

### 4) Error `400` en consola

Este error ocurre cuando la solicitud no contiene información válida para ser procesada por el servidor, específicamente debido a la ausencia, corrupción o invalidación del `token` o `secretClient`.

Esto puede presentarse por múltiples razones, como datos incompletos en la petición, manipulación del flujo de autenticación, o alteraciones en archivos críticos del sistema como `dexly.client.helloid.js` o `com.endpoint.php`.

Para resolverlo, se recomienda restaurar la integridad del proyecto desde su repositorio original o actualizar las dependencias del módulo de autenticación ejecutando:

```bash

npm update helloauth

```

<br>

### 5) Error `404` en la fase `1`
Este error indica que el `token` proporcionado no pudo ser localizado en el sistema de autenticación.

Esto puede deberse a que el token es inválido, no ha sido registrado previamente, ha expirado, o está siendo enviado con un formato incorrecto durante la solicitud.

Se recomienda verificar que el token sea generado correctamente, que no haya sido alterado durante su transmisión, y que coincida exactamente con el registrado en el servidor.

<br>

### 6) Error `404` en la fase `2` o Error `403` en la fase `3`
Este error indica un fallo en el proceso de validación del SecretClient, el cual es utilizado para autenticar y vincular el cliente con su respectivo entorno o bundle.

Puede presentarse cuando el `SecretClient` no existe en el sistema, ha sido configurado incorrectamente o no coincide con el valor registrado en la base de datos. También puede ocurrir debido a errores de escritura, espacios adicionales, caracteres no válidos o si el valor por defecto no fue reemplazado correctamente en el archivo `com.endpoint.php`.

Se recomienda revisar la configuración del cliente, asegurar la consistencia del valor enviado y verificar que coincida exactamente con el registro correspondiente en el sistema.

<br>

### 7) Error `404` en la fase `4`
Este error indica que la cuenta de usuario asociada al proceso de autenticación no se encuentra disponible en el sistema al momento de realizar el handshake con el servidor.

Esto puede ocurrir si el usuario ha sido eliminado, desactivado o si existe una inconsistencia entre los datos de autenticación y los registros de la base de datos.

Se recomienda verificar la integridad del registro del usuario y confirmar que la información asociada al `username` siga existiendo y esté correctamente sincronizada entre los servicios involucrados.

<br><br>

## Obtener información del paquete
Puedes consultar información de HellOAuth usando `helloid.getVersion()`, lo que retornará un objeto con la siguiente estructura:

```json
{
    "mode": "com.dex.platform",
    "version": "7.1.0",
    "developer": "Roger Salinas",
    "vendor": "Dexly Studios LLC",
    "build": "2026.04.20",
    "dexagent": "com.dex.dexagent/7.1.0 (cxi=true; env=production; arch=x64; platform=web; vendor=Dexly Studios LLC)",
    "packagename": "com.dexly.helloid",
    "copyright": "© 2026 Dexly Studios LLC.",
    "dxacompilation": "2026042001•2024111601",
    "fingerprint": "CA:F6:84:94:47:2B:30:AB:BB:9D:E3:40:03:8B:A6:DC:2B:B7:AF:9D:71:32:C5:12:A6:1D:36:1D:9B:AC:BD:3D",
    "state": 200
}

```

<br>

## Obtener información del motor de autenticación
Puedes consultar información de HellOAuth usando `helloid.getProcessor()`, lo que retornará un objeto con la siguiente estructura:

```json
{
    "name": "CrossFlex Processor",
    "serie": "X",
    "model": "X8-20U5G4",
    "manufacturer": "Dexly Studios LLC",
    "version": "198.195.2024",
    "cores": "4",
    "architecture": "x64 ARM (64 Bits)",
    "protocol": "bootx.drm",
    "gen": "12",
    "frecuency": "3.00GHz",
    "completeName": "12th Gen Dexly(R) X(TM) X8-20U5G4 @ 3.00GHz  2.90 GHz",
    "defaultSlot": "X-TPS:CrossFlex_HKEY_CLASSES_ROOT/DRM.flx",
    "kernel": "CrossFlex-5.15.0-67-generic",
    "developer": "Roger Salinas",
    "engineType": "com.dex.platform"
}

```

## Información final del proyecto:

- [Roger Salinas](https://instagram.com/salinxlg) es el creador de este proyecto.
- La versión actual de HellOAuth es `v7.1.4`
- Puedes instalar el proyecto clonando el repositorio o con `npm install helloauth`
- © 2026 Roger Salinas, Dexly Studios, Todos los derechos Reservados.

<br><br><br>
<div align=center>

<img src="docs/sign.svg" width="205px">

</div>