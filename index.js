const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json()); // creates http server
const token = '760815256:AAG95r65CGR77pLff3k5AqKqExXu-0225Zs'; // type here your verification token
const axios = require('axios')

function roll(n) {
    var a = Array(n);
    for (var i = 0; i < n; i++){
      a[i] = Math.ceil(Math.random() * 6);
      a[i] = (a[i] == 0) ? 1 : a[i];
    }
    a = a.sort().slice(n - 3, n);
    return a[0] + a[1] + a[2];
}

app.use(
  bodyParser.urlencoded({
    extended: true
  })
) // for parsing application/x-www-form-urlencoded

//This is the route the API will call
app.post('https://mycharacterbot.herokuapp.com/', function(req, res) {
  const { message } = req.body

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
  if (!message || message.text.toLowerCase().indexOf('/dale') < 0) {
    // In case a message is not present, or if our message does not have the word marco in it, do nothing and return an empty response
    return res.end()
  }

  var arr = Array(6);
  for(var i = 0; i < 6; i++)
    arr[i] = roll(4);
  arr = arr.toString();

  // If we've gotten this far, it means that we have received a message containing the word "marco".
  // Respond by hitting the telegram bot API and responding to the approprite chat_id with the word "Polo!!"
  // Remember to use your own API toked instead of the one below  "https://api.telegram.org/bot<your_api_token>/sendMessage"
  axios
    .post(
      'https://api.telegram.org/bot760815256:AAG95r65CGR77pLff3k5AqKqExXu-0225Zs/sendMessage',
      {
        chat_id: message.chat.id,
        text: arr
      }
    )
    .then(response => {
      // We get here if the message was successfully posted
      console.log('Message posted')
      res.end('ok')
    })
    .catch(err => {
      // ...and here if it was not
      console.log('Error :', err)
      res.end('Error :' + err)
    })
})

// Finally, start our server
app.listen(3000, function() {
  console.log('Telegram app listening on port 3000!')
})