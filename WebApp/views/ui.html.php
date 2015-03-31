<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Promid WTA</title>
        
        <?php // tähän skriptit ja tyylit, injektointi + vaihdetaan oletustagi "script" tagiksi "style": ?>
        <?php injectHTML(array("css/core.css","css/ui.css"),"style"); ?>
                
        <?php /* "pakataan" skriptit ja injektoidaan: 
         * 
         * injectHTML(array("js/functions.js","js/types.js","js/ajax.js","js/client.js","js/button.js","js/screen.js"));
         */ ?>

        <?php // debuggausta varten: ?>
        <script src="js/functions.js"></script>        
        <script src="js/types.js"></script>
        <script src="js/ajax.js"></script>
        <script src="js/client.js"></script>
        <script src="js/session.js"></script>
        <script src="js/button.js"></script>
        <script src="js/screen.js"></script>
        <script src="js/stamp.js"></script>
        <script src="js/timer.js"></script>
        
    <script> 
        
        // luodaan yhteys pääohjelman API-kutsuihin (basic HTTP-authentication)
        var api = new Client("http://api.");
        
        // liitetään API sessioon
        Session.init(api);
        
        var inputValue = "";
        
        <?php // mobiilipurkka (jota ei tyypillisesti saisi olla olemassakaan): ?>
        <?php if ((isset($_GET['mobile'])) && ($_GET['mobile'] == "1")) : ?>
         Session.mobile = true;
        <?php endif ?>
    
    </script>
        
    </head>
    
    <body>
        
        <div class="screen" id="scrLogin">
            <center><img src="img/logo_promid.png" id="frontLogo" onclick="Screen.view('scrStamp')"/></center>
            <div id="timeRunner"></div>
            
            <?php // kun näppäinkoodi on 13 (enter, useiden leimausasemien tekniikka), kirjaudutaan sisään ?>
            <input id="inputTag" onkeydown="if (event.keyCode == 13) Session.login(this.value)" name="tag" value=""/><br/>
        </div>
        
        
        
        <div class="screen" id="scrStamp">
            <div class="header">
                
                <div id="userInfo">
                    <div id="userName"></div>
                    <div id="userState"></div>
                </div>
                
                <div id="sysTray">
                    
                    <div class="icon"  onclick="Session.logout()">
                        <div class="pic"><b>&times;</b></div>
                        <div class="title">Sulje</div>
                    </div>
                    
                </div>
            </div>
        
            <center><div class="container" id="stampMenu"></div></center>
            
            <div class="footer"></div>
        </div>
        
        
        
        <div class="screen" id="scrStamplist"></div>
        
    </body>
    
<script>
<?php 

// haetaan ajastimelle palvelimelta aika
list($date,$time) = explode(" ",date("Y-m-d H:i:s")); list($year,$month,$day) = explode("-",$date); list($hours,$minutes,$seconds) = explode(":",$time); 

?>

Timer.year = <?php echo $year ?>;
Timer.month = <?php echo $month ?>;
Timer.day = <?php echo $day ?>;
Timer.hours = <?php echo $hours ?>;
Timer.minutes = <?php echo $minutes ?>;
Timer.seconds = <?php echo $seconds ?>;
Timer.init($('timeRunner'));
Timer.run();

// sisäänkirjautumiskenttä saa aina fokuksen
$('inputTag').focus();

<?php // tämä piilottaa on-screen -näppäimistön ilmestymisen Androideissa ?>
if (Session.mobile) 
{ $('inputTag').style.display = "none"; }

</script>

</html>