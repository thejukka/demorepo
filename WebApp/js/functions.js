/**
 * 
 * Yleisfunktiot ja konstruktorit, joilla helpotetaan jokapäiväisten 
 * askareiden hoitoa.
 * 
 * 
 */



/*
 * Helpotetaan elementtien hakua, $('.luokka') hakee "luokka"-luokkaan
 * kuuluvat elementit, $('elementti') -hakee elementin id:llä "elementti".
 * Mukavuudenhaluiset voivat käyttää myös jQuerystä tuttua # -merkkiä.
 * Allaolevat esimerkit:
 * 
 * var halutut_elementit = $('.luokkanimi');
 * var minunDivi = $('div-ID');
 * var minunDivi = $('#div-ID'); // vaihtoehtoinen
 */
function $(elm)
{ 
    return (elm.substring(0,1) === "." ? 
                document.getElementsByClassName(elm.substring(1)) : 
                document.getElementById((elm.substring(0,1) === "#" ? elm.substring(1) : elm)));
};





/*
 * Helpotetaan elementtien poistoa, annetaan metodi remove()
 * Esim: $('elementti').remove();
 */
Element.prototype.remove = function () {
    this.parentNode.removeChild(this);
};


/**
 * appendChild -synonyymi, esim:
 * $('elementti').add(new Div("Uusi divi","luokkanimi","id"));
 */
Element.prototype.add = function(elm) {
    this.appendChild(elm);
};




/**
 * Tyhjennetään elementin sisältö tyystin
 */
Element.prototype.flush = function() {
    this.innerHTML = "";
}



/*
 * Div -konstruktori, jolla voidaan JavaScriptistä helposti
 * luoda divejä, esim:
 * 
 * myElm.add(new Div("Sisältöä","diviluokka"));
 */

Div = function(content,className,id,onclick) {
    
    div = document.createElement("div");
    
    if (className !== undefined && className !== null)
    { div.setAttribute("class",className); }
    
    if (id !== undefined && id !== null)
    { div.setAttribute("id",id); }
    
    if (onclick !== undefined && onclick !== null)
    { div.setAttribute("onclick",onclick); }
    
    if (content !== undefined && content !== null)
    { div.innerHTML = content; }
    else
    { div.innerHTML = ""; }
    
    return div;
};