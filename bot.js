function roll(n, f) {
	var a = Array(n);
	for (var i = 0; i < n; i++){
		a[i] = Math.ceil(Math.random() * f);
		a[i] = (a[i] == 0) ? 1 : a[i];
	}
  return a;
}

function sumA(a, arr) {
	var localArr = arr.slice(0);
	localArr.sort((x, y) => { return y-x });
	var ret = 0;
	for(var i = 0; i < a; ++i)
		ret += localArr[i];
	return ret.toString();
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

    var words = msg.text.split(/[ @]+?/);

	switch(words[0].toLowerCase()) {
		case '/dale':
			var output = "";
			var rolls = Array(6);
			for (var i = 0; i < 6; ++i) {
				rolls[i] = roll(4, 6);
				output += ("["+rolls[i].toString()+"] => <b>"+sumA(3, rolls[i])+"</b>\n");
			}
			break;
		case '/roll':
			var numbers = words[1].split(/d/).map(Number);
			var rolls = roll(numbers[0], numbers[1]);
			var output = ("["+rolls.toString()+"] => <b>"+sumA(numbers[0], rolls)+"</b>\n");
			break;
		default:
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