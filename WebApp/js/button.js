/*
 * Painonappi -ja leimanappikonstruktorit (luo divin, jolle annetaan luokka "button/stamp")
 */


var Button = function(title,onclick,id) {
    
    return new Div(title,"button",(id !== undefined ? id : null),(onclick !== undefined ? onclick : null));
    
};
