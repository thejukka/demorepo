/*
 * Sessio-luokka
 */

Session = {
    
    // leimat,tagit,työntekijät,transitiot:
    data: null,
    
    // API-clientti (new Client("http://sejase.com"))
    client: null,
       
    // Istunnon tiedot (työntekijän nimi, ID ja status)
    employeeName: null,
    employeeId: null,
    employeeState: null,    
    
    // Aseman ID
    stationId: 100,
    
    // Offline -määritys
    offline: false,
    
    // Synkka-aika oletuksena offlinelle (sekunneissa)
    synctime: 15,
    
    // Offline-tallennus leimoille
    storage: null,    
    
    // Onko käytettävä laite mobiililaite vai terminaali?
    // (piiloitetaan on-screen -näppäimistö)
    mobile: false,
    
    
    
    
    /*
     * Alustetaan sessioluokka, eli haetaan työntekijä-, leima- ja tagitiedot
     * palvelimelta sessiodataan. Jos ei onnistuta, yritetään samaa vielä
     * sisäänkirjautuessa.
     */
    init: function(apiclient)
    {
      this.client = apiclient;     
      this.data = new Array();       
      this.storage = new Array();
      this.update();
    },
    
    
    

    // Päivitetään sessiodata
    
    update: function()  
    {
        var employees = this.getEmployees();
        var badges = this.getBadges();
        var transitions = this.getTransitions();
        
        if (employees !== null)   this.data.employees = employees;
        if (badges !== null)      this.data.badges = badges;
        if (transitions !== null) this.data.transitions = transitions;  
    },


    
    // Loggaudu sisään tägiarvolla
    
    login: function(tag)
    {
      var now = new Date();
        
      // Päivitetään sessiodata
      this.update();
      

      /* 
       * Tarkistetaan, onko sessioon koskaan haettu tarvittavia tietoja ja jos,
       * niin käytetään niitä. Muutoin ilmoitetaan ongelmasta.
       */
      if (this.data.badges !== null && this.data.employees !== null)
      {
        for (var i in this.data.badges)
        {
           for (var c in this.data.employees)
           {
              if (this.data.badges[i].employee_id == this.data.employees[c].id && tag == this.data.badges[i].value)
              { 
                  // tallennetaan session työntekijämuuttujiin tiedot
                  this.employeeName = this.data.employees[c].lastname+", "+this.data.employees[c].firstname;
                  this.employeeId = this.data.employees[c].id;
                  
                  // Haetaan työntekijän leimat
                  this.data.stamps = this.getStamps(this.employeeId);
                  
                  // Jos on leimoja, käsitellään viimeisin tila
                  if (this.data.stamps !== null)
                  {
                     for (var e in this.data.stamps)
                     {
                        // Muutetaan aikamääreet millisekunneiksi
                        var stampTime = Date.parse(this.data.stamps[e].stamp_time);
                        var nowTime = Date.parse(now);
                        
                        /* Ei oteta leimoja tulevaisuudesta (kuten esim. vuosilomajuttuja
                         * sun muita), vaan jos leima on "tätä hetkeä" vanhempi */
                        if (stampTime < nowTime)
                        {
                           this.employeeState = this.data.stamps[e].stamp_state;
                        }
                     }
                  }
                  
                  // Jos ei ole leimoja, työntekijä on oletettavasti uloskirjautuneena
                  if (this.employeeState === null)
                  { this.employeeState = 2; }
                  
                  // siirrytään leimausnäkymään
                  this.stage(this.employeeState);
              }
           }
        }
        
        // Jos ei tägiarvolle ole liitetty työntekijää, valitetaan
        if (this.employeeId === null)
        {
            window.alert("No employees attached to tag value "+tag);
        }
      }
      
      $('inputTag').value = "";
      
    },
    
    
    
    
    
    
    // Loggaudu ulos, tyhjennä session käyttäjädata ja näytä login -ruutu
    
    logout: function()
    {
        this.employeeName = null;
        this.employeeId = null;
        this.employeeState = null;
        $('inputTag').style.display = "block";
        Screen.view('scrLogin');
        $('stampMenu').flush();
        $('inputTag').focus();
        
        // Piilotetaan on-screen -näppäimistö Androideissa
        if (this.mobile)
        { $('inputTag').style.display = "none"; }
    },
    
    
    
    
    
    


    // Luodaan tilan mukainen valikkonäkymä käyttäjälle
     
    stage: function(code)
    {        
        $('stampMenu').flush();
        $('userName').innerHTML = this.employeeName;
        $('userState').innerHTML = "Tila: "+this.data.transitions[code]['code'];
        
                
        // Luodaan tilan mukaiset valintanapit        
        for (var i in this.data.transitions[code].to)
        {
           $('stampMenu').add(new Stamp(this.data.transitions[code].to[i],i));
        }
        
        // Näytetään 'screeni'
        Screen.view('scrStamp');
    },
    
    
    



    
    
    /**
     * Luodaan leimadata ja pyritään lähettämään se API-kutsuna
     * palvelimelle. Jos ei onnistu, pusketaan data paikalliseen
     * säilöön (Session.storage) ja asetetaan Session.offline todeksi,
     * jolloin pyritään tasaisin aikavälein (Session.synctime) pykäämään
     * dataa palvelimelle.
     */
    stamp: function(code)
    {
        var data = {"stamp_state":code, 
                     "stamp_time":Timer.stampText, 
                     "employee_id":this.employeeId, 
                     "station_id":this.stationId,
                     "project_id":0};
        
        this.client.post("stamps",null,JSON.stringify(data));        
        this.stage(code);
        this.employeeState = code;
    },
    

        
    
    
    // Luodaan metodeiksi tarpeellisimmat API-kutsut ------------------------
    
    
    
    getEmployees: function()
    {
        return this.client.get("employees");
    },

    

    getBadges: function()
    {
        return this.client.get("badges");
    },

    
    getTransitions: function()
    {
        return this.client.get("transitions");
    },
    
    
    // haetaan joko kaikki leimat tai työntekijäkohtaisesti
    getStamps: function(eid)
    {
       if (eid !== undefined)
       { return this.client.get("employees/"+eid+"/stamps/"); }
       else
       { return this.clien.get("stamps"); }
    }
    
    
    
    
    // -----------------------------------------------------------------------
    
    
    
    
};
