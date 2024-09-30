import { MorsePlayer } from './morse-player.js';
import '../node_modules/tone/build/Tone.js'

const morsePlayer = new MorsePlayer();

$(function() {
    $('#textInput').keydown(function(e) {
        if(e.which == 13) {
            textToMorse();
            $(this).blur();

            if(morsePlayer.running) {
                restartMorse();
            }
        }
    });

    $('#textInput').on('focusout', function() {
        textToMorse();
        if(morsePlayer.running) {
            restartMorse();
        }
    });

    $('#clearBtn').click(function() {
        $('#textInput').val('');
        $('#textOutput').empty();
        $('#textInput').focus();
    });

    $('#ditSample').on('change', async function() {
        await morsePlayer.setDit(this.files[0]);
        checkForSamples();
    });

    $('#dahSample').on('change', async function() {
        await morsePlayer.setDah(this.files[0]);
        checkForSamples();
    });

    $('#playBtn').on('click', async function() {
        await Tone.start();
        let morse = $('#textOutput').html();

        if(morse.length > 0) {
            morsePlayer.stopMorse();
            morsePlayer.playMorse(morse);
        }

    });

    $('#stopBtn').on('click', function() {
        morsePlayer.stopMorse();
    });

    $('#rateRange').on('input', function() {
        morsePlayer.rate = $(this).val();
        $('#rateLabel').html(morsePlayer.rate + 'ms');
    });

    $('#loopToggle').on('change', function() {
        let loop = $(this).prop('checked');
        morsePlayer.loop = loop;
    });
});

function restartMorse() {
    morsePlayer.stopMorse();
    setTimeout(morsePlayer.playMorse.bind(morsePlayer, $('#textOutput').html()), 500);
}

function checkForSamples() {
    if(morsePlayer.dit.loaded && morsePlayer.dah.loaded) {
        $('#textInput').prop('disabled', false);
        $('#playBtn').prop('disabled', false);
    }
}

function textToMorse() {
    let text = $('#textInput').val();
    $('#textOutput').empty();
    $('#textOutput').show();
    $('#textOutput').append(morsePlayer.encode(text));
}


