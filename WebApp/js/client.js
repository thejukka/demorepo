/*
 * API REST Client
 * Konstruktori, joka määrittelee käytettävän palvelimen. Esim: 
 * 
 * api = new Client("http://api.promid.fi/sejase","user","pass");
 * 
 */


Client = function(url,userpass) {
    
    /*
     * Muuttuja palvelinosoitteelle, korjataan myös osoitemuotoa
     * jos lopussa ei ole kenoviivaa
     */
    this.url = (url.substring(0,-1) !== "/" ? url+"/" : url);
    
    
    /*
     * Valjastetaan Ajax -käyttöön.
     */
    Ajax.init(url,userpass);
    
    
    /*
     * GET -komento, esim: api.get('employees',32);
     * 
     * tai jos halutaan työntekijältä esim. leimat: 
     * 
     * api.get('employees',32,'stamps');
     */
    this.get = function(path, val, parms) {
        
        var parm = (parms !== undefined ? parms.split("/") : "");
        
        return Ajax.request("GET",url+(path.substring(0,-1) !== "/" ? path+"/" : path+""));
        
    };
    
    
    
    /*
     * POST -komento, esim: api.post('employees',32,json_data);
     */
    this.post = function(path, val, json) {
        
        return Ajax.request("POST",url+(path.substring(0,-1) !== "/" ? path+"/" : path+"")+(val !== null ? '/'+val+'/' : '/'),(json ? json : ''));
        
    };
    
    
    
    /*
     * DELETE -komento, esim: 
     * 
     * if (api.delete('employees',32,json_data).status = AJAX_STATUS_OK)
     *  { window.alert("Homma hoidettu!"); }
     * else
     *  { window.alert("Kaamea erhe: "+api.handler.response.message); }
     * 
     */
    this.delete = function(path, val, json) {
        
        return Ajax.request("DELETE",url+path+(val !== undefined ? '/'+val+'/' : '/')+(json ? json : ''));
        
    };
    
    
    
    /*
     * PUT -komento
     */
    this.put = function(path, val, json) {
        
        return Ajax.request("PUT",url+path+(val !== undefined ? '/'+val+'/' : '/')+(json ? json : ''));
        
    };
    
};