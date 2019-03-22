function ParseRequest(msg) {
    if(!msg || msg.text == undefined)
        return null;

    var ret = {
        'command': (/(\/[a-z]+)/i).exec(msg.text).slice(1,-3),
        'dies': (/([+-]*[1-9]+?[0-9]*d[1-9]+?[0-9]*)/ig).exec(msg.text).slice(1,-3),
        'modifiers': (/([+-][1-9]+?[0-9]*(?![0-9]*d))/ig).exec(msg.text).slice(1,-3)
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

module.exports = {
    ParseRequest: ParseRequest,
    ParseDie: ParseDie
};