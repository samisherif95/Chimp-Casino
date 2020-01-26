const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function validateMessage(data){
    let error = {};

    data.text = validText(data.text) ? data.text : '';
    
    if(Validator.isEmpty(data.text)){
        errors.text = "You can't send an empty message"
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };

}