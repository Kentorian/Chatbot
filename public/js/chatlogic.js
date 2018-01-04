//initializing
var ws = new WebSocket("wss://vaf-bff-web.mybluemix.net/ws/messages");
var Message,getMessageText, message_side, sendMessage;
//debuggers
var output = true;
var input = true;
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
//IF IOS, deletes recorder element
if (iOS==false){
  $('#recordContainer').remove();
  console.log('iOS not compatible with audio recorder');
}
//Conversation Start
 ws.onopen = function(event){
   console.log("¡Websocket Online!");
   initialmsg = {
     message: "hola",
     type: "message"
   };
   ws.send(JSON.stringify(initialmsg));
   $(".message_input").prop( "disabled", false );
   $(".message_input").attr("placeholder", "Escribe un mensaje...");
 }

//Keeping alive
keepalive = {
  message:"/keepalive",
  type:"command"
}
setInterval(function(){
  console.log("KeepingAlive");
  ws.send(JSON.stringify(keepalive));
}, 30000);


// -----------Main function----------
(function () {
Message = function (arg) {
    this.text = arg.text, this.message_side = arg.message_side;
    this.draw = function (_this) {
        return function () {
            var $message;
            $message = $($('.message_template').clone().html());
            $message.addClass(_this.message_side).find('.text').html(_this.text);
            $('.messages').append($message);
            return setTimeout(function () {
                return $message.addClass('appeared');
            }, 0);
        };
    }(this);
    return this;
};

$(function () {

    // GetMessageText Function
    getMessageText = function () {
        var $message_input;
        $message_input = $('.message_input');
        return $message_input.val();
    };

    // SendMessage Function
    sendMessage = function (text,side,type,filepath) {
      webmessage = {
        message:text,
        type: type
      }
      message_side = side;
      //output debug
      if(text!=""){
        ws.send(JSON.stringify(webmessage));
        if (output==true){
          console.log(webmessage);
        }
      }
      var $messages, message;
      if (text.trim() === '') {
          return;
      }
      $('.message_input').val('');
      $messages = $('.messages');
      if (type == "audio"){
        message = new Message({
            text: "<audio controls><source src=" + filepath + " type='audio/ogg'>Tu navegador no soporta el elemento audio.</audio>",
            message_side: message_side
        });
      }else{
        message = new Message({
            text: text,
            message_side: message_side
        });
      }
      message.draw();
      return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
    };

    //ReceiveMessage Function
    receiveMessage = function (text,side) {
      message_side = side;
      var $messages, message;
      if (text.trim() === '') {
          return;
      }
      $('.message_input').val('');
      $messages = $('.messages');
      message = new Message({
          text: text,
          message_side: message_side
      });
      message.draw();
      return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
    };

    //Trigger Functions
    $('.send_message').click(function (e) {
        return sendMessage(getMessageText(),'right','message');
    });

    $('.message_input').keyup(function (e) {
        if (e.which === 13) {
            return sendMessage(getMessageText(),'right','message');
        }
    });
});
}.call(this));

//receiveMessage trigger
ws.onmessage = function(event){
watson_res = JSON.parse(event.data);
agent = watson_res.agent;
message = watson_res.message;
if(input==true){
  console.log(watson_res);
}
if (watson_res.type == "status"){
  // NOTHING TO DO HERE
}else{
    receiveMessage(message,"left");
    $('.title').html(watson_res.agent.name);
}
}
