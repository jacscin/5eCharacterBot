function ParseRequest(msg) {
    if(!msg || msg.text == undefined)
        return null;
    
    var regex = RegExp('([+-]*[1-9]+?[0-9]*d[1-9]+?[0-9]*[hl]*)','ig');
    var auxArray;
    
    var dies = [];
    while((auxArray = regex.exec(msg.text)) != null) {
        dies.push(auxArray[0]);
    }

    regex = RegExp('([+-][1-9]+?[0-9]*(?![0-9]*d))','ig');
    var modifiers = [];
    while((auxArray = regex.exec(msg.text)) != null) {
        modifiers.push(auxArray[0]);
    }

    var ret = {
        'command': (/(\/[a-z]+)/i).exec(msg.text)[0],
        'dies': dies,
        'modifiers': modifiers
    };

    return ret;
};

function ParseDie(die) {
    if(!die == undefined)
        return null;

    if (!isNaN(parseInt(die[0])))
        die = '+'+die;

    regex = RegExp('([0-9]+)','g');
    var auxArray;

    var numbers = [];
    while((auxArray = regex.exec(die)) != null) {
        numbers.push(auxArray[0]);
    }

    var ret = {
        'modifier': parseInt(die[0]+'1'),
        'quantity': parseInt(numbers[0]),
        'faces': parseInt(numbers[1]),
        'pool': (/[hl]+/gi).exec(die)[0]
    }

    return ret;
};

module.exports = {
    ParseRequest: ParseRequest,
    ParseDie: ParseDie
};