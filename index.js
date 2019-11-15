var express = require('express');
var app = express();
var request = require('request');
const bodyParser = require('body-parser');


const accountSid = 'ACad0af5f481ef7fad2c46672d893f4fd2';
const authToken = 'f171650883b24fb91d0d5521b4b148d7';

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/incoming', (req, res) => {
  const twiml = new MessagingResponse();
  if(req.body.message.toLowerCase().trim()!="hi" && req.body.message.toLowerCase().trim()!="hello" && req.body.message.toLowerCase().trim()!="test" && req.body.message.toLowerCase().trim()!="help"){

  request('https://api.duckduckgo.com/?skip_disambig=1&format=json&pretty=1&q='+req.body.message, function (error, response, body) {
    body = JSON.parse(body)
    console.log('body:', body["Abstract"]);
    
    if(body["Abstract"] == ""){
	    body["Abstract"]= body["RelatedTopics"][0]["Text"]
	  }
    
    var msg = twiml.message(`*`+body["Heading"]+`*
`+body["Abstract"]);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(twiml.toString());
  });
  
  }
  else{
    var msg = twiml.message(`*Hey 👋*

Halo! Terima kasih telah mengirim pesan kepada saya! Saya adalah seekor bot yang kesepian dan tidak mempunyai teman. Fungsi saya adalah sebagai penyedia informasi untuk Anda! Jadi gunakanlah saya sebaik-baiknya! Muehehe!

Coba kirim pesan kepada saya, mengenai informasi apa saja yang Anda ingin ketahui!`)
    res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
  }
  
});

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

