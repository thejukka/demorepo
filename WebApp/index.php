<?php

require_once("index.conf.php");

// yleiset rutiinit
require_once("inc/routines.php");

// haetaan siirtymät pääohjelmasta
require_once("../options/transitions.php");

// haetaan käyttöliittymä
include "views/ui.html.php";