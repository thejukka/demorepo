Timer = {
    
   day: 0,
   month: 0,
   year: 0,
   hours: 0,
   minutes: 0,
   seconds: 0,
   textTime: "",
   textDate: "",
   textDateStamp: "",
   stampText: "",
   customTime: null,
   parent: null,
   
   
   /**
    * Alusta ajastusluokka
    */
   init: function(elm)
   {
      this.updateText();
      
      if (elm === undefined) this.parent = document.body;
      else this.parent = elm;
   },
   
   
   
   /**
    * Päivitä aikamerkkijonot
    */
   updateText: function()
   {
      this.textDate = (this.day < 10 ? "0"+this.day : this.day) + "." + 
                      (this.month < 10 ? "0"+this.month : this.month) + "." + this.year;
     
      this.textTime = (this.hours < 10 ? "0"+this.hours : this.hours) + ":" +
                      (this.minutes < 10 ? "0"+this.minutes : this.minutes) + ":" +
                      (this.seconds < 10 ? "0"+this.seconds : this.seconds);
              
      this.textDateStamp = this.year + "-" + (this.month < 10 ? "0"+this.month : this.month) + "-" +
                                             (this.day < 10 ? "0"+this.day : this.day);              
                             
                             
      // YYYY-MM-DD HH:ii:ss (leimausta varten)
      this.stampText = this.textDateStamp+" "+this.textTime;
   },
   
   
   
   
   
   /**
    * Kasvata aikaa ja tarvittaessa päivämäärää
    */
   increaseTime: function()
   {     
      this.seconds++;
      
      if (this.seconds == 60)
      { this.seconds = 0; this.minutes++; }
  
      if (this.minutes == 60)
      { this.seconds = 0; this.minutes = 0; this.hours++; }
      
      if (this.hours == 24)
      { this.seconds = 0; this.minutes = 0; this.hours = 0;
        this.increaseDate(); }
          
      this.updateText();
   },
   
   
   
   
   
   /**
    * Kasvata päivämäärää
    */
   increaseDate: function()
   {
      this.day++;
           
      if (this.day == 30)
      { this.day = 1; this.month++; }
  
      if (this.month == 12)
      { this.day = 1; this.month = 1; this.year++; }
   },
   
   
   
   /**
    * Ulosta aika
    */
   say: function()
   { this.parent.innerHTML = this.textDate+"<br/>"+this.textTime; },



   /**
    * Päivitä ajastin sekunnittain
    */
   run: function()
   {
      this.say();      
      this.increaseTime();      
      window.setTimeout("Timer.run()",1000);
   }
};