/**
 * Stamp -konstruktori: luo leimausnapin
 */

Stamp = function(title,code) {

    // Luodaan leimausnappi
    return new Div(title,"stamp",null,"Session.stamp("+code+")");

}