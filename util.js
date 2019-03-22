function ParseRequest(msg) {
    if(!msg || msg.text == undefined)
        return null;

    var ret = {
        'command': (/(\/[a-z]+)/i).exec(msg.text),
        'dies': (/([+-]*[1-9]+?[0-9]*d[1-9]+?[0-9]*)/gi).exec(msg.text),
        'modifiers': (/([+-][1-9]+?[0-9]*(?![0-9]*d))/gi).exec(msg.text)
    };

    return ret;
};

function ParseDie(die) {
    var ret = {
        'modifier': parseInt((/^[+-]/).exec(die)+'1'),
        'quantity': parseInt((/[0-9]+/).exec(die)),
        'faces': parseInt((/[0-9]+$/).exec(die))
    }

    return ret;
};

export { ParseRequest, ParseDie };