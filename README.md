### Chatbot Frontend:
Este es un Frontend que se conecta via [WebSocket](https://es.wikipedia.org/wiki/WebSocket) a una api que administrara el canal para una conversacion de watson conversation.

* tiene integracion para mensajes via voz con [SpeechToText](https://console.bluemix.net/docs/services/speech-to-text/index.html#about) si es que se desea y configura.

* Tiene soporte para diferentes dispositivos y navegadores

#### Credenciales:

##### Input:
Esta web recibe un objeto JSON con el siguiente formato:
```
{
  "message": (String), // el texto del mensaje que se recibe de parte de watson.
  "agent": (string) // nombre de el agente con quien se esta entablando
                      una conversacion
}
```
El nombre del agente por defecto es watson, puede ser cambiado enviandolo por ``agent`` desde la api, o modificarlo desde el codigo del Frontend.

##### Output:
Esta web envia un objeto JSON con el siguiente formato:
```
{
  "message": (String), # mensaje en bruto que envia el cliente
  "type": (string) # tipo de mensaje (message ,command ,audio)
}
```
Los tipos de mensaje ayudan a que el api asignado detone acciones a base de estas.


##### Tipos de mensaje:

* message: Mensaje normal dentro de una conversación

* command: Este es enviado para ignorar el flujo de conversacion y detonar una acción, por defecto, este front contiene un keepalive que envia un mensaje de tipo ``"command"`` con un mensaje que contiene ``"/keepalive"``

* audio: Este tipo de mensaje tiene como objetivo advertirle a el api asignado que se esta enviando un archivo de audio, este audio es enviado en ``Base64`` , este debe ser decodificado dentro de el api para ser procesado por el [SpeechToText](https://console.bluemix.net/docs/services/speech-to-text/index.html#about).
