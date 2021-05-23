
module.exports = class Tokenizer {

    static produceToken(username, firstName, lastName, connection_time) {
        console.log(username,firstName,lastName,connection_time);
        let usernameENC = this.ENCRYPT_CAESAR(1,username);
        let firstNameENC = this.ENCRYPT_CAESAR(1,firstName);
        let lastNameENC = this.ENCRYPT_CAESAR(1,lastName);
        let connection_time_String = connection_time.toString();
        console.log(connection_time_String);
        let SESSION_TOKEN = "";
        SESSION_TOKEN = SESSION_TOKEN + connection_time_String[23];
        SESSION_TOKEN = SESSION_TOKEN + firstNameENC[2];
        SESSION_TOKEN = SESSION_TOKEN + usernameENC[2];
        SESSION_TOKEN = SESSION_TOKEN + usernameENC[5];
        SESSION_TOKEN = SESSION_TOKEN + lastNameENC[1];
        SESSION_TOKEN = SESSION_TOKEN + connection_time_String[17];
        SESSION_TOKEN = SESSION_TOKEN + usernameENC[6] + usernameENC[7];
        SESSION_TOKEN = SESSION_TOKEN + connection_time_String[19] + connection_time_String[20];
        SESSION_TOKEN = SESSION_TOKEN + usernameENC[0];
        SESSION_TOKEN = SESSION_TOKEN + firstNameENC[0];
        return SESSION_TOKEN;
    }

    static ENCRYPT_CAESAR(shift, text) {
        let encrypted_text = "";
        for(let i = 0; i< text.length; i++) {
            if(text[i]>='A' && text[i]<='Z' && !((text[i].charCodeAt(0) + shift) > 90))
                encrypted_text = encrypted_text + String.fromCharCode(text[i].charCodeAt(0) + shift);
            else if(text[i]>='A' && text[i]<='Z' && ((text[i].charCodeAt(0) + shift) > 90))
                encrypted_text = encrypted_text + String.fromCharCode(text[i].charCodeAt(0) + shift - 26);
            else if(text[i]>='a' && text[i]<='z' && !((text[i].charCodeAt(0) + shift) > 122))
                encrypted_text = encrypted_text + String.fromCharCode(text[i].charCodeAt(0) + shift);
            else if(text[i]>='a' && text[i]<='z' && ((text[i].charCodeAt(0) + shift) > 122))
                encrypted_text = encrypted_text + String.fromCharCode(text[i].charCodeAt(0) + shift - 26);
            else 
                encrypted_text = encrypted_text + text[i];
        }
        return encrypted_text;
    }

    static DECRYPT_CAESER(key, encrypted_text) {
        let text = "";
        for(let i = 0; i< encrypted_text.length; i++) {
            if(encrypted_text[i]>='A' && encrypted_text[i]<='Z' && !((encrypted_text[i].charCodeAt(0) - key) < 65))
                text = text + String.fromCharCode(encrypted_text[i].charCodeAt(0) - key);
            else if(encrypted_text[i]>='A' && encrypted_text[i]<='Z' && ((encrypted_text[i].charCodeAt(0) - key ) < 65))
                text = text + String.fromCharCode(encrypted_text[i].charCodeAt(0) - key + 26);
            else if(encrypted_text[i]>='a' && encrypted_text[i]<='z' && !((encrypted_text[i].charCodeAt(0) - key) < 97))
                text = text + String.fromCharCode(encrypted_text[i].charCodeAt(0) - key);
            else if(encrypted_text[i]>='a' && encrypted_text[i]<='z' && ((encrypted_text[i].charCodeAt(0) - key) < 97))
                text = text + String.fromCharCode(encrypted_text[i].charCodeAt(0) - key + 26);
            else 
                text = text + encrypted_text[i];
        }
        return text;
    }
}