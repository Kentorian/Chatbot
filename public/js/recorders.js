$(document).ready(function () {
  // Ask for permissions

  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia;

var codedaudio;
reader = new FileReader();
if (navigator.getUserMedia) {
  var recordbuttonpress = false;
  var audioOn = new Audio('public/sounds/recorderOn.ogg');
  var audioOff = new Audio('public/sounds/recorderOff.ogg');
  options = {
    bitsPerSecond: 16000
  }
  //Progress Circle animation config
  var circle = new ProgressBar.Circle('#progress', {
      color: 'rgba(252, 0, 0, 0.47)',
      duration: 1000,
      easing: 'linear',
      strokeWidth: 50
  });
  //-----------------------
   console.log('getUserMedia supported.');
   navigator.getUserMedia (
      // constraints - only audio needed for this app
      {
         audio: true
      },

      // Success callback
      function(stream) {
        var mediaRecorder = new MediaRecorder(stream,options);

        var audioarray = [];
        mediaRecorder.ondataavailable = function(e) {
          audioarray.push(e.data);
        }
        // Recording
        $('.recordButton').mousedown(function (){
            recordbuttonpress = true;
            circle.animate(1,{
              duration:1000,
              from: { color: 'rgba(252, 0, 0, 0.46)' },
              step: function(state, circle, attachment) {
                circle.path.setAttribute('stroke', state.color);
              }
            });
            console.log(mediaRecorder.state);
            console.log("Start recording");
            window.setTimeout(function(){
              if (recordbuttonpress==true){
                mediaRecorder.start(1000);
                recordbuttonpress = false;
              }
            }, 1000);
        });

        $('.recordButton').mouseup(function (){
          recordbuttonpress = false;
          circle.set(0);
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
          console.log("Recorder stopped");
          $('.recordButton').css("background-color: initial");
        });

        mediaRecorder.onstart = function(e) {
          audioOn.play();
          circle.set(0);
          circle.animate(1,{
            duration:10000,
            from: { color: 'rgba(0, 247, 14, 0.46)' },
            step: function(state, circle, attachment) {
              circle.path.setAttribute('stroke', state.color);
            }
          });

          recordtimeout = setTimeout(function(){
            if (mediaRecorder.state=='recording'){
              mediaRecorder.stop();
            }
          }, 10000);
          console.log("recordtimeout value:"+ recordtimeout);
        }

        mediaRecorder.onstop = function(e) {
          clearTimeout(recordtimeout);
          audioOff.play();
          circle.set(0);
          var blob = new Blob(audioarray, { 'type' : 'audio/webm; codecs=vorbis' });
          var blobURL = URL.createObjectURL(blob);
          blobsize  = blob.size;
          reader.readAsDataURL(blob);
          reader.onload = function(event){
            codedaudio = reader.result;
            console.log(codedaudio);
            audiourl = event.target.result;
            console.log("Audio length: "+audioarray.length);
            sendMessage(codedaudio,'right','audio',blobURL);
            console.log("MediaStreamrecorder stopped");
            audioarray = [];
            };
        }
      },

      // Error callback
      function(err) {
         console.log('The following gUM error occured: ' + err);
      }
   );
} else {
  $("#recordContainer").hide();
   console.log('getUserMedia not supported on your browser!');
}

});
