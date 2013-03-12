/*
    i4TV javascript library
    Version: 0.0.1
    Author: Zhang Ping 
*/

(function () {

    /*
        chinese stroke input method.
    */
    var strokeInstructionSet = {
        "1": 'h',
        "2": 's',
        "3": 'p',
        "4": 'n',
        "5": 'z',
        "0 1": 37, // left arrow
        "0 2": 39, // right arrow
        "0 3": 46, // delete
        "0 4": 8, // backspace
        "0 5": 9, // Tab, input method switch.
        "0 6": 13, // Enter, ok, complete.
        "0 7": 36 // home, Help
    },

    strokeEngine = new WebSocket('ws://www.i4tv.cn:8088/websocket/');
    strokeEngine.onmessage = function (evt) {
        var candidat = '';
        if (document.getElementById ('selectbox').innerHTML != '') {
            delSelectOpcode ();
        }
        for (var i = 0; i < evt.data.length; i++) {
            if (i < 10) {
                candidat += '6 0 ' + i + '.' + evt.data[i] + ' ';
                var opcode = '6 0 ' + i;
                addOpcode (opcode, evt.data[i], strokePickOn);
            } else if (i < 100) {
                candidat += '6 ' + Math.floor(i / 10) + ' ' + (i % 10) + evt.data[i] + ' ';
                var opcode = '6 ' + Math.floor(i / 10) + ' ' + (i % 10);
                addOpcode (opcode, evt.data[i], strokePickOn);
            }
        }
        document.getElementById ('selectbox').innerHTML = candidat;
    };

    /*
        opcode be pressed, means virtual key press.
    */
    function strokeKeypress (key) {
        var strokebox = document.getElementById ('strokebox');
        strokebox.value += key;
        console.log (key);
        strokeEngine.send (strokebox.value);
    }

    function delSelectOpcode () {
        for (var i = 600; i < 630; i++) {
            var opcodestr = i.toString (),
                keys = opcodestr.split (''),
                opcode = keys[0];
            for (var j = 1; j < keys.length; j++) {
                opcode = opcode + ' ' + keys[j];
            }
            delOpcode (opcode);
        }
    }

    /*
        pick on the word, clear strokeinput and remove words from strokeinstructionset.
    */
    function strokePickOn (word) {
        var inputbox = document.activeElement;
        inputbox.value += word;
        strokebox.value = '';
        selectbox.innerHTML = '';
        delSelectOpcode ();
    }

    /*
        stroke inputbox.
        +-----------+---------------+
        |           |   strokebox   |
        |           | +-----------+ |
        |           | |strokeinput| |
        |           | +-----------+ |
        |           +---------------+
        |           |               |
        |           |               |
        |           |    buttons    |
        |           |               |
        |           |               |
        +-----------+---------------+
          selectbox      panel
    */ 
    function strokePanel (element, instructionset) {
        // prevent from add inputbox more than one.
        if (document.getElementById ('inputbox'))
                 return;

        var inputbox = document.createElement ('div'),
            selectbox = document.createElement ('div'),
            panel = document.createElement ('div'),
            strokebox = document.createElement ('div'),
            buttons = document.createElement ('div'),
            strokeInput = document.createElement ('input');
        inputbox.appendChild (selectbox);
        inputbox.appendChild (panel);
        panel.appendChild (strokebox);
        panel.appendChild (buttons);
        inputbox.setAttribute ('id', 'inputbox');
        inputbox.setAttribute ('class', 'inputbox');
        selectbox.setAttribute ('id', 'selectbox');
        selectbox.setAttribute ('class', 'selectbox');
        strokeInput.setAttribute ('id', 'strokebox');
        strokebox.appendChild (strokeInput);
        buttons.setAttribute ('class', 'buttons');
        buttonsHTML = '<ul>';
        for (var opcode in instructionset) {
            buttonsHTML += '<li class="key">' + instructionset[opcode] + '<hr>' + opcode + '</li>'
        }
        buttonsHTML += '</ul>';
        buttons.innerHTML = buttonsHTML;
        document.body.appendChild (inputbox);
    }

    /*
        instruction set, i4TV
        key: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
        index: key index in the opcode.
        length: length of the opcode.
        opcode: for example: 01, 02.
        instruction: corresponding action.
    */
    var instructionSet = {},

        currentIndex = {},

        currentOpcodeLength = 0,

        timerReset;

    /*
        opcode: code.
        instruction: keyprocess function.
        select: select the hanzi.
    */
    function addOpcode (opcode, virtualkey, instruction) {
        currentIndex[opcode] = 0;
        keys = opcode.split(' ');

        var increaseIndex = function (key) {
                //console.log ('opcode is ' + opcode);
                ++currentIndex[opcode];
                resetTimer ();
            },

            executeInstruction = function () {
                instruction (virtualkey);
            };

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!instructionSet[key]) {
                instructionSet[key] = [];
            }
            if (i == keys.length-1) {
                record = {
                    key: key,
                    index: i,
                    length: keys.length,
                    opcode: opcode,
                    instruction: executeInstruction
                };
            } else {
                record = {
                    key: key,
                    index: i,
                    length: keys.length,
                    opcode: opcode,
                    instruction: increaseIndex
                };
            }
            instructionSet[key].push (record);
        }
    }

    function delOpcode (opcode) {
        var keys = opcode.split (' ');

        reset ();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            for (var j = 0; j < instructionSet[key].length; j++) {
                if (instructionSet[key][j].opcode === opcode) {
                    instructionSet[key].splice (j, 1);
                }
            }
        }
    }

    /*
        reset to origin status, cancel timeout keypress.
    */
    function reset () {
        for (opcode in currentIndex)
            currentIndex[opcode] = 0;
        currentOpcodeLength = 0;
    }

    function resetTimer () {
        clearTimeout (timerReset);
        timerReset = setTimeout (reset, 1000);
    }

    /*
        keypress, find matches.
    */
    function getMatchInstructions (key) {
        var matches = [];

        if (!instructionSet[key]) {
            return [];
        }
        for (i = 0; i < instructionSet[key].length; i++) {
            instruction = instructionSet[key][i];
            if (currentIndex[instruction.opcode] > instruction.length) {
                continue;
            }
            //console.log (currentOpcodeLength + ' : ' + instruction.length + ' : ' + instruction.opcode + ' : ' + instruction.index);
            if (currentOpcodeLength == instruction.index) {
                matches.push (instruction);
            }
        }
        if (matches.length > 0)
            currentOpcodeLength++;
        return matches;
    }

    /*
        keypress handler.
    */
    function keyHandle (e) {
        key = String.fromCharCode (e.which);
        instructions = getMatchInstructions (key);
        for (i = 0; i < instructions.length; i++) {
            //console.log ('handle' + currentIndex[instructions[i].opcode] + ' : ' + instructions[i].length);
            if (currentIndex[instructions[i].opcode] == instructions[i].index) {
                instructions[i].instruction (key);
                if (currentOpcodeLength == instructions[i].length) {
                    // match a opcode, reset
                    reset ();
                    break;
                }
            }
        }

        e.preventDefault ();
    }

    window.addEventListener ('keypress', keyHandle);

    var i4TV = function (className) {

        return {
            chineseInput: function (inputmethod) {

                inputs = document.getElementsByClassName (className);

                // bind event.
                for (i = 0; i < inputs.length; i++) {
                    /*
                        callback to initialize instruction panel and initialize instruction table.
                        initialization of instruction table take instruction panel as para.
                    */
                    inputs[i].onfocus = function () {

                        if (inputmethod === 'stroke') {
                            for (opcode in strokeInstructionSet) {
                                addOpcode (opcode, strokeInstructionSet[opcode], strokeKeypress);
                            }
                        }

                        strokePanel (inputs[i], strokeInstructionSet);
                    }
                    inputs[i].onblur = function () {
                        document.body.removeChild (inputbox);
                        instructionSet = {};
                        currentIndex = {};
                    }
                }
            },

            display: function () {
                return [instructionSet, currentIndex];
            }
        }
    }

    // Expose i4TV
    window.i4TV = i4TV;

})();
