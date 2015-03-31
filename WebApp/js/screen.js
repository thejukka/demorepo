/*
 * Screeniluokka, hoitaa ns. screenien (login,stamp,stamplist)
 * näytettävyyden ja muun skeidan. Oletuksena näkyvissä on login-
 * screeni. (views/ui.html.php). Käyttöesim:
 * 
 * Screen.view('divi-ID');
 * 
 * HUOM: mikäli luodaan lisää omia screenejä, tulee niiden kuulua
 * luokkaan "screen".
 * 
 */

Screen = {
    
    /*
     * Näytä haluttu screeni
     */
    view: function(elmId)
    {
        /*
         * Ensin piilotetaan kaikki...
         */
        this.hideAll();
        
        /*
         * ...sitten näytetään haluttu
         */
        $(elmId).style.display = "block";
    },
    
    
    
    /*
     * Piiloita kaikki screenit
     */
    hideAll: function()
    {
        
    /*
     * Haetaan kaikki screeniluokkaan kuuluvat elementit...
     */
      var screens = $('.screen');
      
      /*
       * ...joille kaikille annetaan komento piiloutua
       */      
      for (var i in screens)
      {
          if (screens[i].id !== undefined)
          {
              $(screens[i].id).style.display = "none";
          }
      }
    },
    
    
};