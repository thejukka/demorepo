/*
 * Ajax-objekti. Halutessa voidaan autentikoida käyttäjänimellä ja/tai
 * salasanalla. Ennen käyttöä pitää alustaa: Ajax.init("http://sejase.com","user:pass");
 */

Ajax = {
    
    /*
     * Handleri
     */
    http: null,
    
    /*
     * Cache, jonne heivataan tavaraa, jota voidaan myöhemmin tarkastella
     */
    response: null,
    
    /*
     * Käyttäjätunnukset (Base64 -koodattuna)
     */
    userpass: null,
    
    /*
     * Alusta Ajax
     */
    init: function(url,path,userpass)
    {
        if (userpass !== undefined)
        { this.userpass = userpass; }
        
        /**
         * Tsekataan, onko Ajax käytettävissä, ja jos ei: damn you!
         * Muussa tapauksessa se alustetaan.
         */
        
        if (window.XMLHttpRequest)
        { Ajax.http = new XMLHttpRequest(); }

        else
        {      
           try 
           { Ajax.http = new ActiveXObject("Msxml2.XMLHTTP"); }

           catch (e)
           {
             try { Ajax.http = new ActiveXObject("Microsoft.XMLHTTP"); }
             catch (e) { window.alert("Could not init Ajax!\nPlease update your browser"); }     
           }
        }
        
        /*
         * Asetetaan eventhandleri, joka määrittelee, että kutsun onnistuessa
         * heivataan cacheen tavaraa.
         */
        this.http.onreadystatechange=function() {
          if (Ajax.http.readyState == 4 && Ajax.http.status == AJAX_STATUS_OK)
          { Ajax.response = Ajax.http.responseText; }           
        }
                
    },
    
    
    
    authorization: function()
    {
        this.http.setRequestHeader("Authorization","Basic "+this.userpass);
    },
    
    
    /*
     * Lähetä kutsu halutulla metodilla, parametreilla,datalla (JSON)
     * ja määritä vaihtoehtoisesti myös asynkronoituneisuus (oletuksena
     * False)
     */
    request: function(method,parms,data,async)
    {
        var sync = (async === undefined ? false : async);
        
        /*
         * Handlataan metodit
         */
        switch (method)
        {
            case "POST":
                this.http.open(method,parms,sync);
                this.http.setRequestHeader("Content-type","application/json; Charset=utf-8");    
            break;
            
            
            case "PUT":
                this.http.open(method,parms,sync);
                this.http.setRequestHeader("Content-type","application/json; Charset=utf-8");
            break;            
                
            default:
                this.http.open(method,parms,sync);
        }
        
        
        /*
         * Palautetaan palvelimen vastaukset parsetettuna arrayksi
         */

        Ajax.http.send((data !== undefined ? data : ""));
        
        return (this.response !== null ? JSON.parse(this.response) : false);
    }
    
};