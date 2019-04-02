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
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    var ret = localArr.slice(0, a).reduce(reducer);
console.log(ret);
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
    var output = "";
	switch(params['command']) {
		case '/dale':
			var rolls = Array(6);
			for (var i = 0; i < 6; ++i) {
                rolls[i] = roll(4, 6);
				output += ("["+rolls[i].toString()+"] => <b>"+sumA(3, rolls[i]).toString()+"</b>\n");
			}
            break;
            
        case '/roll':
            var total = modResult = 0;

            if(params['dies'].length > 0) {
                output += ("<b>Rolls</b>\n");
                params['dies'].forEach(die => {
                    var curDie = ParseDie(die);
                    var resultArr = roll(curDie['quantity'], curDie['faces']);
                    var poolSum;
                    var sortArr = resultArr.slice();
                    console.log(params);
                    switch (params['pool']) {
                        case 'h':
                            sortArr.sort((x, y) => { return y-x });
                            poolSum = sortArr[0];
                            break;
                        case 'l':
                            sortArr.sort((x, y) => { return x-y });
                            poolSum = sortArr[0];
                            break;
                        default:
                            poolSum = sumA(curDie['quantity'], resultArr);
                            break;
                    }
                    var result = curDie['modifier'] * poolSum;
                    total += result;
                    output += ("["+die+"] => ["+resultArr.toString()+"] => <b>"+result+"</b>\n");
                });
            }

            if(params['modifiers'].length > 0) {
                output += ("<b>Modifiers</b>\n");
                params['modifiers'].forEach(mod => {
                    modResult += parseInt(mod);
                });
                total += modResult;
                output += ("["+params['modifiers'].toString()+"] => <b>"+modResult+"</b>\n");
            }

            output += ("<b>Total\n"+total+"</b>");
            break;
        
        case null:
            break

        default:
		    output = "This command is invalid, sorry.";
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