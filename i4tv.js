/*
    i4TV javascript library
    Version: 0.0.1
    Author: Zhang Ping 
*/

(function () {

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
        instruction set, i4TV
        key: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
        length: length of the opcode.
        opcode: for example: 01, 02.
        instruction: corresponding action.
    */
    var instructionSet = {},

        currentIndex = {};

        currentOpcodeLength = 0;

    function addOpcode (opcode, instruction) {

        currentIndex[opcode] = 0;
        keys = opcode.split(' ');

        var increaseIndex = function (key) {
                ++currentIndex[opcode];
            },

            executeInstruction = function (key) {
            };

        for (i=0; i<keys.length; i++) {
            key = keys[i];
            if (!instructionSet[key]) {
                instructionSet[key] = [];
            }
            if (i == keys.length-1) {
                record = {
                    key: key,
                    length: keys.length,
                    opcode: opcode,
                    instruction: instruction
                };
            } else {
                record = {
                    key: key,
                    length: keys.length,
                    opcode: opcode,
                    instruction: increaseIndex
                };
            }
            instructionSet[key].push (record);
        }
    }

    function reset () {
        for (opcode in currentIndex)
            currentIndex[opcode] = 0;
        currentOpcodeLength = 0;
    }

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
            if (currentOpcodeLength >= instruction.length) {
                continue;
            }
            matches.push (instruction);
        }
        if (matches.length > 0)
            currentOpcodeLength++;
        return matches;
    }

    function keyHandle (e) {
        key = String.fromCharCode (e.which);
        instructions = getMatchInstructions (key);
        for (i = 0; i < instructions.length; i++) {
            currentIndex[instructions[i].opcode]++;
            if (currentIndex[instructions[i].opcode] == instructions[i].length) {
                alert (instructions[i].instruction);
                reset ();
                break;
            }
        }
    }

    window.addEventListener ('keypress', keyHandle);

    var i4TV = function (className) {
        return {
            chineseInput: function (inputmethod) {
                if (inputmethod === 'stroke') {
                    set = strokeInstructionSet;
                }

                for (opcode in set) {
                    addOpcode (opcode, set[opcode]);
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
