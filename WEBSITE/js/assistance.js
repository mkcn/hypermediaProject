var DEBUG = false;
var windowHeight = $(window).height();
var windowWidth = $(window).width();
var epsilon = 0.1;

jQuery(window).resize(function () {
    if( 
        (Math.abs( (windowHeight - $(window).height()) / (windowHeight + $(window).height())) < epsilon &&
        Math.abs( (windowWidth - $(window).width()) / (windowWidth + $(window).width())) < epsilon ) && 
        Math.abs( (windowHeight - $(window).height()) / (windowHeight + $(window).height())) !== 0 &&
        Math.abs( (windowWidth - $(window).width()) / (windowWidth + $(window).width())) !== 0 
        ){
        return;
    }
    
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
       && windowWidth === $(window).width()){
        return;
    }else{
        windowWidth = $(window).width();
    }
    placeFooter();
});

function placeFooter() {
    $('#footer').css({ 'margin-top': 0 });
    windowHeight = $(window).height();
    windowWidth = $(window).width();
    var windowH = $(window).height();
    var wrapperH = $('#header').height() + $('#page_title').height() + $('#content').height();
    if( windowH > wrapperH ) {
        $('#footer').css({ 'margin-top': ( windowH - wrapperH ) });        
    }
    //when page is complete select the current item of the menu
    $("document").ready(function(){ $('#menu_assistenza').addClass('current');});
    
}

/************************   AJAX REQUESTS   **************************/
/*********************************************************************/

//path for phonegap that needs the real path and not the relative

var basePath;

if(DEBUG){
    basePath = '';
}else{
    basePath = 'http://timhypermedia.altervista.org/'
}



//async ajax request
$("document").ready(function() {
    
    var id = $_GET('Id');
    $.ajax({
        method: "GET",
        //dataType: "text", //type of data
        crossDomain: true,
        url: basePath + "db/sql_list_assistance.php", //Relative or absolute path to file.php file
        data: {Id: id},
        success: function (response) { 

            //parse the json and get an array where the index is the row and the .User is the name of the column
            var resultArray = $.parseJSON(response);
            
            
            //Add the html for the page
            
            // create some helper element
            var contentElement = document.createElement("DIV");
            var titleParag = document.createElement("DIV");
            var subtitleParag = document.createElement("DIV");
            subtitleParag.setAttribute("class", "acc_content");
            var elements = document.createElement("UL");
            elements.setAttribute("class", "iconlist");
            var title = 0;
            var subtitle = 0;
            
            
            for (i = 0; i < resultArray.length ; i++){
                
                // if new paragraph is found
                if (resultArray[i].Title_id > title) {
                    if (elements.hasChildNodes()) {
                        subtitleParag.appendChild(elements);
                        elements = document.createElement("UL");
                        elements.setAttribute("class", "iconlist");
                        titleParag.appendChild(subtitleParag);
                        subtitleParag = document.createElement("DIV");
                        subtitleParag.setAttribute("class", "acc_content");
                    }
                    if (titleParag.hasChildNodes()) {
                        contentElement.appendChild(titleParag);
                        contentElement.appendChild(document.createElement("BR"));
                        contentElement.appendChild(document.createElement("BR"));
                    }
                    contentElement.appendChild(buildParagraph(resultArray[i].Title));
                    titleParag = document.createElement("DIV");
                    titleParag.setAttribute("class", "acc_content");
                    title = resultArray[i].Title_id;                  
                }
                
                // if new subparagraph is found
                if (resultArray[i].Subtitle_id > subtitle) {
                    if (elements.hasChildNodes()) {
                        subtitleParag.appendChild(elements);
                        elements = document.createElement("UL");
                        elements.setAttribute("class", "iconlist");
                        titleParag.appendChild(subtitleParag);
                    }
                    titleParag.appendChild(buildSubparagraph(resultArray[i].Subtitle));
                    subtitle = resultArray[i].Subtitle_id;
                    subtitleParag = document.createElement("DIV");
                    subtitleParag.setAttribute("class", "acc_content");
                }
                elements.appendChild(buildElement(resultArray[i].Element, resultArray[i].Link));
            }
            
            // add final values 
            if (elements.hasChildNodes()) {
                subtitleParag.appendChild(elements);
                titleParag.appendChild(subtitleParag);
                contentElement.appendChild(titleParag);
            }
            
            $("#assistance_content").append(contentElement);
            buildPage(resultArray[0].Service);
            placeFooter();
        },
        error: function(request,error) {
            console.log(request+":"+error);
        }
    });
});





/***************************************************************************/
/* helper functions to build highlights page*/
/***************************************************************************/

function buildPage(service) {
    document.title = service;
    var titleElement = buildTitleElement(service);
    $("#assistance_title").append(titleElement);
    var imageElement = buildImageElement(service);
    $("#assistance_image").append(imageElement);
}

function buildTitleElement(title) {
    var titleElement = document.createElement("H1");
    titleElement.innerHTML = title;
    return titleElement;
}

function buildImageElement(service) {
    var image = document.createElement("IMG");
    image.setAttribute("class", "img-rounded");
    image.setAttribute("src", "images/assistenza/" + service + ".png");
    image.setAttribute("alt", service);
    return image;
}

function buildParagraph(title) {
    var titleElement = document.createElement("H3");
    titleElement.innerHTML = title;
    return titleElement;
}

function buildSubparagraph(title) {
    var titleElement = document.createElement("H5");
    titleElement.innerHTML = title;
    return titleElement;
}

function buildElement(description, link) {
    var elem = document.createElement("LI");
    var aElement = document.createElement("A");
    var iElement = document.createElement("I");
        
    iElement.setAttribute("class", "icon-play");
    aElement.setAttribute("href", "page.assistance.html?Id=" + link);
    aElement.innerHTML = description;
    
    elem.appendChild(iElement);
    elem.appendChild(aElement);
    
    return elem;
}




/***************************************************************************/
/* helper functions to read get parameters*/
/***************************************************************************/

function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}