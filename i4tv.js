/*
    i4TV javascript library
    Version: 0.0.1
    Author: Zhang Ping 
*/

(function () {

    /*
        chinese stroke input method.
    */
    strokeInstructionSet = {
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
    }

    /*
        opcode be pressed, means virtual key press.
    */
    function strokeKeypress (key) {
        console.log (key);
    }

    /*
        stroke input panel.
    */
    function strokePanel (element, instructionset) {
        var panel = document.createElement ('div'),
            selectbox = document.createElement ('div'),
            right = document.createElement ('div'),
            strokebox = document.createElement ('div'),
            buttons = document.createElement ('div'),
            strokeInput = document.createElement ('input');
        panel.appendChild (selectbox);
        panel.appendChild (right);
        right.appendChild (strokebox);
        right.appendChild (buttons);
        panel.setAttribute ('id', 'panel');
        panel.setAttribute ('class', 'panel');
        selectbox.innerHTML = 'selectbox';
        selectbox.setAttribute ('class', 'selectbox');
        strokebox.appendChild (strokeInput);
        buttons.setAttribute ('class', 'buttons');
        buttonsHTML = '<ul>';
        for (var opcode in instructionset) {
            buttonsHTML += '<li class="key">' + instructionset[opcode] + '<hr>' + opcode + '</li>'
        }
        buttonsHTML += '</ul>';
        buttons.innerHTML = buttonsHTML;
        document.body.appendChild (panel);
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

        for (i=0; i<keys.length; i++) {
            key = keys[i];
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
            instructions[i].instruction (key);
            if (currentOpcodeLength == instructions[i].length) {
                reset ();
                break;
            }
        }
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

                        //panel.style.position.left = inputs[i].offsetLeft;
                        strokePanel (inputs[i], strokeInstructionSet);
                        //panel.style.display = 'block';
                    }
                    inputs[i].onblur = function () {
                        //panel.style.display = 'none';
                        document.body.removeChild (panel);
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
