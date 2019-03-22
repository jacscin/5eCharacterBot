var { ParseRequest } = require('./util');
var { ParseDie } = require('./util');

function roll(n, f) {
	var a = Array(n);
	for (var i = 0; i < n; i++){
		a[i] = Math.ceil(Math.random() * f);
		a[i] = (a[i] == 0) ? 1 : a[i];
	}
  return a;
}

function sumA(a, arr) {
	var localArr = arr.slice();
	localArr.sort((x, y) => { return y-x });
	var ret = localArr.slice(0, a).reduce((ret, cur) => { ret + cur });
	return ret;
}

const token = process.env.TOKEN;
const Bot = require('node-telegram-bot-api');
let bot;

if(process.env.NODE_ENV === 'production') {
	bot = new Bot(token);
	bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
	bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.on('message', (msg) => {
	if(!msg || msg.text == undefined)
		return;

	var params = ParseRequest(msg);
console.log(params['command']);
console.log(params['dies']);
console.log(params['modifiers']);
	switch(params['command']) {
		case '/dale':
			var output = "";
			var rolls = Array(6);
			for (var i = 0; i < 6; ++i) {
                rolls[i] = roll(4, 6);
console.log(rolls[i]);
				output += ("["+rolls[i].toString()+"] => <b>"+sumA(3, rolls[i]).toString()+"</b>\n");
			}
			break;
        case '/roll':
            var total = 0;
            var output = "";
            
            params['dies'].forEach(die => {
                var curDie = ParseDie(die);
                var roll = roll(curDie['quantity'], curDie['faces']);
                result = curDie['modifier'] * sumA(curDie['quantity'], roll);
                total += result;
                output += ("["+die+"] => <b>"+result+"</b>\n");
            });
            var modResult = 0;
            params['modifiers'].forEach(mod => {
                modResult += parseInt(mod);
            });
            total += modResult;
            output += ("["+params['modifiers'].toString()+"] => <b>"+modResult+"</b>\n");
            output += ("[Total] => <b>"+total+"</b>");
			break;
		default:
		var output = "This command is invalid, sorry.";
			break;
	}

	bot.sendMessage(chat_id=msg.chat.id,
  								text=output,
  								{reply_to_message_id: msg.message_id,
  								parse_mode: 'HTML'}).then(() => {
    // reply sent!
  });
});

module.exports = bot;