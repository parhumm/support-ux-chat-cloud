//
// Define Words and Variables
//

const   words_badWords        = require('./words/bad-words.js'),
        words_replaceIt       = require('./words/replace-it.js'),
        words_carefullyRemove = require('./words/carefully-remove.js'),
        words_forceRemove     = require('./words/froce-remove.js'),
        words = {};



// 'Force Remove' Words
words.forceRemove       = words_forceRemove.words;

// 'Carefully Remove' Words
words.carefullyRemove   = words_carefullyRemove.words;

// 'Replace It' Words
words.replaceIt         = words_replaceIt.words;

// Replace Bad Words with ***
for (var i = 0; i < words_badWords.words.length; i++) {
    words.replaceIt[words_badWords.words[i]] = '***';
}



//
// Force Remove Function
//

var forceRemove = function(message) {
    var clearMessage = message;

    // console.log('>> Force Remove <<');
    // console.log('Input: ', clearMessage);

    for (var j = 0; j < words.forceRemove.length; j++) {
        var targetWord = words.forceRemove[j],
            exceptWordIndex = clearMessage.indexOf(targetWord);

        if (exceptWordIndex > -1) {
            clearMessage = clearMessage.replace( new RegExp( '[' + targetWord + ']', 'g' ), ' ' );
        }
    }

    // console.log('Output: ', clearMessage);
    // console.log('-------------------');

    return clearMessage;
}



//
// Replace Words Function
//

var replaceWords = function(wordcloudContent, content) {
    // console.log('>> REPLACE <<');
    // console.log('Input: ', wordcloudContent);

    for (var key in words.replaceIt) {
        var targetWord = key,
            exceptWordIndex = wordcloudContent.indexOf(targetWord);

        if (exceptWordIndex > -1) {
            var wordPositionFlag = '';

            if (targetWord.length === wordcloudContent.length) {
                // ONLY ONE WORD
                wordPositionFlag = 'onlyOne';
                targetWord = targetWord;
            } else if (exceptWordIndex === 0 ) {
                // FIRST WORD
                wordPositionFlag = 'first';
                targetWord = targetWord + ' ';
            } else if ((exceptWordIndex + targetWord.length) === wordcloudContent.length) {
                // END WORD
                wordPositionFlag = 'end';
                targetWord = ' ' + targetWord;
            } else {
                // MIDDLE WORD
                wordPositionFlag = 'middle';
                targetWord =  ' ' + targetWord + ' ';
            }

            wordcloudContent = wordcloudContent.replace( new RegExp( targetWord, 'g' ),  ' ' + words.replaceIt[key] + ' ' );
            content = content.replace( new RegExp( targetWord, 'g' ),  ' ' + words.replaceIt[key] + ' ' );
        }
    }

    // console.log('Output: ', wordcloudContent);
    // console.log('-------------------');

    return {
        wordcloudContent: wordcloudContent,
        content: content,
    };
}



//
// Carefully Remove Function
//

var carefullyRemove = function(message) {
    // console.log('>> Carefully Remove <<');
    // console.log('Input: ', message);

    for (var j = 0; j < words.carefullyRemove.length; j++) {
        var targetWord = words.carefullyRemove[j],
            exceptWordIndex = message.indexOf(targetWord);

        if (exceptWordIndex > -1) {
            var wordPositionFlag = '';


            if (targetWord.length === message.length) {
                // ONLY ONE WORD
                wordPositionFlag = 'onlyOne';
                targetWord = targetWord;
            } else if (exceptWordIndex === 0 ) {
                // FIRST WORD
                wordPositionFlag = 'first';
                targetWord = targetWord + ' ';
            } else if ((exceptWordIndex + targetWord.length) === message.length) {
                // END WORD
                wordPositionFlag = 'end';
                targetWord = ' ' + targetWord;
            } else {
                // MIDDLE WORD
                wordPositionFlag = 'middle';
                targetWord =  ' ' + targetWord + ' ';
            }

            message = message.replace( new RegExp( targetWord, 'g' ), ' ' );
        }
    }
    // console.log('Output: ', message);
    // console.log('-------------------');

    return message;
}



//
// Word Washing Function
//

var wordWashing = function(message) {
    var output = {
        wordcloudContent: message,
        content: message,
    };

    //
    // 1) Remove Force
    //
    output.wordcloudContent = forceRemove(output.wordcloudContent);


    //
    // 2) Replace
    //
    var replaceWordsOutput  = replaceWords(output.wordcloudContent, output.content);
    output.wordcloudContent = replaceWordsOutput.wordcloudContent;
    output.content          = replaceWordsOutput.content;


    //
    // 3) Carefully Remove
    //
    output.wordcloudContent = carefullyRemove(output.wordcloudContent);


    return output;
}



//
// Export Variables
//

module.exports = {
    washing : wordWashing
};