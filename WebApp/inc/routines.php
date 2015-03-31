<?php

/*
 * Perustoimintoja ja funktioita
 */


/*
 * Poistetaan lähteestä (koodista) kaikki epähalutut
 * merkit, oletuksena välilyönnit, tabit, rivinvaihdot yms.
 */
function stripSource($source,$notwanted=array("\r","\n","\t","  ","   "))
{    
    /*
     * Poistetaan ensin kommenttirivit
     */
    $source = preg_replace('!/\*.*?\*/!s', '', $source);
    $source = preg_replace('/\n\s*\n/', "\n", $source);

    /*
     * Sitten muut haluamattomat skeidat
     */
    foreach ($notwanted as $chr)
    {
        $source = str_replace($chr," ",$source);
    }
    
    return $source;
};


/*
 * Liitetään suoraan HTML -koodiin stripattu sorsa, joko yksi tiedosto
 * tai useampi (array), oletuksena <javascript> -tagi
 */
function injectHTML($files,$tag="script")
{
    /*
     * Alustetaan injektio- ja lähdekoodimuuttuja (teksti)
     */
    $injection = "<$tag>#</$tag>";
    $source = ""; 
    
    if (is_array($files))
    {
        foreach ($files as $file)
        {
            if (file_exists($file))
            {
                $source .= stripSource(file_get_contents($file));
            }
        }
    }
    
    else
    {
        if (file_exists($file))
        {
            $source = stripSource(file_get_contents($files));
        }
    }
    
    echo str_replace("#",$source,$injection);
};