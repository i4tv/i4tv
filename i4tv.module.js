/*
    i4TV javascript library
    Version: 0.0.1
    Author: Zhang Ping 
*/

(function (window, document) {

    var version = '0.0.1',

    inputEngine = 'ws://www.i4tv.cn:8088/websocket/',

    chineseInput = {
        /**
         * table of keypad and process function when the keypad being pressed.
         */
        keypadsDictionary : {},

        /**
         * stroke input.
         */
        stroke : {
            /**
             * input sequences, for example: 1121 -> hhsh -> 一一丨一.
             */
            inputseq: "",
            strokekeypads: {
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
        },

        /**
         * chinese pin yin input.
         */
        pinyin : {
            inputseq: "",
            pinyinkeypads: {
            }
        }
    }

    function inputInit(inputmethod) {
        var keypads = chineseInput[inputmethod]["strokekeypads"],
        keypadsDictionary = {};

        for (name in keypads) {
            keypadsDictionary[name] = keypads[name];
        }

        chineseInput['keypadsDictionary'] = keypadsDictionary;
    }

    i4TV = {
        i4TV : function (className) {
            var inputs = document.getElementsByClassName (className);
                panel = document.createElement ('div');
                panel.setAttribute ('id', 'panel');
                panel.setAttribute ('class', 'panel');
                panel.style.position = 'absolute';
                panel.style.display = 'none';
                document.body.appendChild (panel);
                stroke = document.createElement ('input')
                panel.appendChild (stroke);
                illuminate = document.createElement ('div');
                illuminate.innerHTML = '<div class="button light">1. 一</div><div class="button">2. 丨</div> 3. 丿 4. 丶 5. 乛';
                panel.appendChild (illuminate);
                word = document.createElement ('div');
                panel.appendChild (word);
                word.innerHTML = '.';

                websocket = new WebSocket(inputEngine); 
                websocket.onmessage = function (evt) {
                    var candidat = '';
                    for (i=0; i<evt.data.length; i++) {
                        candidat += '6' + i + '.' + evt.data[i] + ' ';
                    }
                    word.innerHTML = candidat;
                };

                strokestr = '';

            window.addEventListener ('keypress', function (event) {
                e = window.event || event;
                e = e.charCode || e.keyCode;
                alert(e);
                switch (e) {
                case 49:
                    stroke.value = stroke.value + '一';
                    strokestr += 'h';
                    websocket.send (strokestr);
                    break;
                case 50:
                    stroke.value = stroke.value + '丨';
                    strokestr += 's';
                    websocket.send (strokestr);
                    break;
                case 51:
                    stroke.value = stroke.value + '丿';
                    strokestr += 'p';
                    websocket.send (strokestr);
                    break;
                case 52:
                    stroke.value = stroke.value + '丶';
                    strokestr += 'n';
                    websocket.send (strokestr);
                    break;
                case 53:
                    stroke.value = stroke.value + '乛';
                    strokestr += 'z';
                    websocket.send (strokestr);
                    break;
                default:
                }
            }, false);

            return {
                chineseInput: function (inputmethod) {
                    // initialize input panel
                    inputInit(inputmethod);

                    // bind event.
                    for (var i=0; i<inputs.length; i++) {
                        inputs[i].onfocus = function () {
                            //panel.style.position.left = inputs[i].offsetLeft;
                            panel.style.display = 'block';
                        }
                        inputs[i].onblur = function () {
                            panel.style.display = 'none';
                        }
                    }
                },
                dict : function() {
                    return chineseInput['keypadsDictionary'];
                }
            }
        }
    }

    // Expose i4tv functions to global
    for (var fn in i4TV) {
        window[fn] = i4TV[fn];
    }

    i4TV.version = version;
    //window.i4TV = i4TV;

})(window, document);
