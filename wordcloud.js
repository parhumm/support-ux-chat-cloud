//
// Word Cloud
//

var maxWeightDouble = 0,
    maxWeightSingle = 0,

    doubleMaxWeight = '',
    singleMaxWeight = '',

    doubleWordcloud = {},
    singleWordcloud = {},

    wordcloud = function(message) {
        var wordsArr       = message.split(' '),
            data   = {
                single: [],
                double: [],
            };


        for (var i = 0; i <= wordsArr.length; i++) {
            if (typeof wordsArr[i] === 'undefined' || wordsArr[i].length === 0) {
                continue;
            }


            //
            // Single Word
            //

            if (singleWordcloud[wordsArr[i]]) {
                singleWordcloud[wordsArr[i]] = singleWordcloud[wordsArr[i]] + 1;
            } else {
                singleWordcloud[wordsArr[i]] = 1;
            }

            // Find Max Weight
            if (singleWordcloud[wordsArr[i]] > maxWeightSingle) {
                maxWeightSingle = singleWordcloud[wordsArr[i]];
                singleMaxWeight = wordsArr[i];
            }



            //
            // Double Word
            //

            var wc2dKey = '';

            if (typeof wordsArr[i + 1] === 'undefined' || wordsArr[i + 1].length === 0) {
                if (typeof wordsArr[i - 1] === 'undefined' || wordsArr[i - 1].length === 0) {
                    continue;
                } else {
                    wc2dKey = wordsArr[i - 1] + ' ' + wordsArr[i];
                }
            } else {
                wc2dKey = wordsArr[i] + ' ' + wordsArr[i + 1];
            }

            if (doubleWordcloud[wc2dKey]) {
                doubleWordcloud[wc2dKey] = doubleWordcloud[wc2dKey] + 1;
            } else {
                doubleWordcloud[wc2dKey] = 1;
            }

            // Find Max Wieght
            if (doubleWordcloud[wc2dKey] > maxWeightDouble) {
                maxWeightDouble = doubleWordcloud[wc2dKey];
                doubleMaxWeight = wc2dKey;
            }
        }

        for (var key in doubleWordcloud) {
            if (doubleWordcloud[key] > Math.round(maxWeightDouble/3)) {
                data.double.push({name: key, weight: doubleWordcloud[key]});
            }
        }

        for (var key in singleWordcloud) {
            if (singleWordcloud[key] > Math.round(maxWeightSingle/3)) {
                data.single.push({name: key, weight: singleWordcloud[key]});
            }
        }

        return data;
    };



//
// Export Variables
//

module.exports = {
    update : wordcloud
};