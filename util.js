function ParseRequest(msg) {
    if(!msg || msg.text == undefined)
        return null;
    
    var regex = RegExp('([+-]*[1-9]+?[0-9]*d[1-9]+?[0-9]*)','ig');
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

    var ret = {
        'modifier': parseInt(die[0]+'1'),
        'quantity': parseInt((/[0-9]+/).exec(die)[0]),
        'faces': parseInt((/[0-9]+$/).exec(die)[0])
    }

    return ret;
};

module.exports = {
    ParseRequest: ParseRequest,
    ParseDie: ParseDie
};