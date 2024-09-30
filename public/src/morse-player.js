import '../../node_modules/tone/build/Tone.js';

export class MorsePlayer {
    constructor() {
        this.dit = new Tone.Player().toDestination();
        this.dah = new Tone.Player().toDestination();

        this.playing = false;
        this.running = false;
        this.rate = 200;
        this.loop = true;
    }

    playMorse(morse) {
        if (this.running) {
            this.stopMorse();
        }
        
        let index = 0;
        const playNext = () => {
            if (!this.running) return;
    
            if (index >= morse.length) {
                if (this.loop) {
                    index = 0;
                } else {
                    this.running = false;
                    return;
                }
            }
            
            const char = morse[index];
            index++;
            
            if (char === '.') {
                this.playDit();
                setTimeout(playNext, this.rate);
            } else if (char === '-') {
                this.playDah();
                setTimeout(playNext, this.rate * 2);
            } else if (char === '/') { 
                setTimeout(playNext, this.rate * 3);
            } else {
                setTimeout(playNext, this.rate);
            }
        };
    
        this.running = true;
        playNext();
    }
    

    async stopMorse() {
        this.running = false;

        await this.dit.stop();
        await this.dah.stop();
    }

    async setDit(file) {
        const url = URL.createObjectURL(file);
        await this.dit.load(url);
    }
    
    async setDah(file) {
        const url = URL.createObjectURL(file);
        await this.dah.load(url);
    }

    playDit() {
        this.dit.stop();
        setTimeout(() => {
            this.dit.start();
        }, 10);
    }
    
    playDah() {
        this.dah.stop();
        setTimeout(() => {
            this.dah.start();
        }, 10);
    }

    encode(text) {
        let map = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 
            'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', 
            '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', 
            '9': '----.', '0': '-----', ' ': '/'
        }

        text = text.replace(/[^a-zA-Z0-9 ]/g, "");        
        return text.toUpperCase().split('').map(char => map[char] || char).join(' ');
    }

    decode(morse) {
        return morse.split(' ').map(code => Object.keys(map).find(key => map[key] === code) || code).join('');
    }
}
