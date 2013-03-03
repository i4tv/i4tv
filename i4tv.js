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
        index: index of the key in opcode.
        opcode: for example: 01, 02.
        instruction: corresponding action.
    */
    var instructionSet = {},

        currentIndex = {};

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
                record = {key: key, index: i, opcode: opcode, instruction: instruction};
            } else {
                record = {key: key, index: i, opcode: opcode, instruction: increaseIndex};
            }
            instructionSet[key].push (record);
        }
    }

    function keyHandle (e) {
        alert(e.which);
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
                return instructionSet;
            }
        }
    }

    // Expose i4TV
    window.i4TV = i4TV;

})();
