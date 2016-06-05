function init()
{
    document.getElementById('getVideo').addEventListener('change',openLocalVideo,
							 false);

    document.getElementById('getSettings').addEventListener('change', loadSettingsFile, false);
    
    //if (localStorage.player != undefined)
    //{
    //	$("#player").val(localStorage.player);
    //}
    
    getStoredProjects();
    
    $(".controlButtonRow > td > button").addClass("controlButton");
    $("#buttoncontainer > button").addClass("controlButton")
    //bindButton("ctrl+l", "1");
    //Make global video object
    //video = document.getElementById("video");
}




//Globals
currentCodes = []; //An array used for the current codes with modified behaviors
projSettings = null; //An object that contains the settings of current project



//http://www.html5rocks.com/en/tutorials/file/dndfiles/
function openLocalVideo(evt){
    var files = evt.target.files;


    //Init some variables and clear old ones
    localStorage.csvresult = "";

    if (!useModifiers())
    {
	localStorage.csvresult += "Time Code Class\r\n";
    }
    else
    {
	var header = "Time";
	for (i=1; i <= projSettings.nClasses; i++)
	{
	    header += " Class" + i;
	}
	localStorage.csvresult +=  header + "\r\n"; 
    }
    
    $("button").removeClass("active")
    $("#results").html("");

    //Check which player is going to be used
    var value = $("#player").val();
    
    //Add the player to DOM
    if (value == "html")
    {
	$("#videocontainer").html("<video controls='controls' id='video'> </video>");
	video = $("#video")[0];
	
	//Works in Firefox
	//Works in Chrome, but you need to start it with
	//--allow-file-access-from-files
	window.URL = window.URL || window.webkitURL;
	var videoURL = window.URL.createObjectURL(files[0]);
	video.src = videoURL;
	localStorage.player = value;
	video.onloadeddata = resizeVideo;
    }
    
    if (value == "vlc")
    {
	$("#videocontainer").html("<embed type='application/x-vlc-plugin' pluginspage='http://www.videolan.org' version='VideoLAN.VLCPlugin.2' width='640' height='480' id='vlc'></embed>");
	video = new vlc(document.getElementById("vlc"))
	//Full URL of the file comes from project video directory and selected file
	var fileURL = "file:///" + getVideoDir() + files[0].name;
	//console.log(fileURL);
	video.video.playlist.add(fileURL);
	localStorage.player = value;
    }
    
    $(".prefs").hide();
    $("#subjectprefs").show();
    
    resizePrefs();

}

function getVideoDir()
{
    var dir = $("#videoDir").val().replace("\\", "/"); 
    if (dir.charAt(dir.length-1) != "/")
    {
	dir += '/';
    }
    
    return dir;
}

//Video methods that aren't included in HTML5 spec
function videoFwd()
{
    var amount = parseInt($("#seekInput").val());
    console.log(amount);
    video.currentTime = video.currentTime + amount;
}

function videoBack()
{
    var amount = parseInt($("#seekInput").val());
    video.currentTime = video.currentTime - amount;
}


function videoStop()
{
    video.pause();
    video.currentTime = 0;
}

function saveData()
{
    var filename = $("#subjectName").val() + "_" + $("#subjectDate").val() + "_" + $("#subjectTime").val() + ".txt";
    if (filename.length == 6)
    {
	filename = "transcipt.txt";
    }
    exportData(localStorage.csvresult, filename);
}


function openData()
{
    generator = window.open('', 'results', '');
    generator.document.body.innerHTML = "<pre>" + localStorage.csvresult + "</pre>"; 
}


function writeresults()
{
    //Hack for chrome
    if (isChrome())
    {
	if (generator.document.body == null)
	{
	    setTimeout("writeresults()", 100)
	}
	else
	{
	generator.document.body.innerText = localStorage.csvresult;
	}
    }
    //Firefox
    else
    {
	generator.document.write('<pre>' + localStorage.csvresult + '</pre>');
    }
}


function code(sender){
    var code = sender.innerHTML;

    $("#results").html("<strong>Time:</strong> " + Math.round(video.currentTime*100)/100 + " <strong>Code: </strong>" + code + "<BR/>");
    //    localStorage.htmlresult += Math.round(video.currentTime*100)/100 + " " + sender.innerHTML + "<BR/>";
    
    //Get the column of sender
    var colIndex = $(sender).parent().parent().find("td").index($(sender).parent());
    //console.log(colIndex)
    var tdIndex = colIndex + 1;
    //console.log(tdIndex);
    
    //Set the pressed button as active
    //$(sender).parent().find("button").removeClass("active");
    
    //If there are no modifiers write to results
    if (!useModifiers())
    {
	localStorage.csvresult += Math.round(video.currentTime*100)/100 + " " + code
	    + " " + tdIndex +   "\r\n";
    }
    else
    {
	//Check if current code has modifiers
	if (modifierArray.indexOf(code) > -1)
	{
	    //pause until a code with no modifier is hit
	    video.pause();
	    currentCodes[colIndex] = code;
	    $(sender).siblings().attr("disabled", "disabled");
	    $(sender).attr("disabled", "disabled");
	    
	    //console.log("Bloody modifiers!");
	}
	else
	{
	    currentCodes[colIndex] = code;
	    //Remove extra indices from currentCodes
	    currentCodes = currentCodes.slice(0, tdIndex);
	    //remove active class from other cols
	    //$("button.codeButton").removeClass("active");
	    
	    //console.log("No modifiers!");
	    console.log(currentCodes.join(" "));
	    localStorage.csvresult +=  Math.round(video.currentTime*100)/100 + " " + currentCodes.join(" ") + "\r\n";
	    video.play();
	    $("button.codeButton").removeAttr("disabled");
	}

	$(sender).siblings().removeClass("active");
	$(sender).addClass("active");
	
    }
}




function setSpeed()
{
    video.playbackRate = parseFloat(document.getElementById("speed").value);
}

function setSize()
{
    var mult = document.getElementById("size").value;
    video.width = video.videoWidth*mult;
    video.height = video.videoHeight*mult;
}

function showHelp()
{
    var help = document.getElementById("help");
    var link = document.getElementById("helphref");
    if (help.style.display == "block")
    {
	help.style.display = "none";
	link.innerHTML = "Show help";
    }
    else
    {
	help.style.display = "block";
	link.innerHTML = "Hide help";
    }
}

function toggleBlock(id)
{   
    var div = document.getElementById(id);
    
    //Get the state of desired DIV
    var state = div.style.display;

    //Hide the whole prefs class
    $(".prefs").hide()
    //Try to set smart width
    //$(".prefs").width($("#content").width() - $("#buttoncontainer").width() - 100)
    resizePrefs();

    //Show the desired div if it was hidden
    if (state == "block")
    {
	div.style.display = "none";
	//link.innerHTML = "Show help";
    }
    else
    {
	div.style.display = "block";
	//link.innerHTML = "Hide help";
    }
}

function resizePrefs()
{
    $(".prefs").width($("#content").width() - $("#buttoncontainer").width() - 100)
}

function resizeVideo(e)
{
    var divWidth = $("#content").width() - $("#buttoncontainer").width() - 50
    //console.log(divWidth);
    if (video.videoWidth > divWidth)
    {
	$("#video").width(divWidth);
    }
    
    //$("#video").width($("#content").width() - $("#buttoncontainer").width() - 50)
}


function isChrome()
{
 return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
}

function addCodeFields(classNo){
    var n = parseInt($("#classNo").val());
    html = ""
    for (i=1; i<=n; i++)
    {
	html += "Code" +  i + " name: <input type='text'><br/>" ;
    }
    
    html += "<button onclick='saveCodes()'>Save</button>"

    $("#addCodes").html(html);
}

function saveCodes()
{
    var inputs = $("#addCodes > input")
    codes = [];
    var select = "</BR><select>";
    var buttons = "";

    for (i = 0; i < inputs.length; i++)
    {
	codes[i] = inputs[i].value;
	select += "<option value='" + codes[i] + "'>" + codes[i] + "</option>";
	buttons += "<button onclick='code(this)'>" +  codes[i] + " </button><BR/>"
    }
    
    select += "</select></BR>";
    $("#codelabel").before(select)
    $("#addCodes").html("");
    $("#buttonrow > td:first").html(buttons);
    $("#codelabel").html("Number of modifiers for code:");

}

function useModifiers()
{
    return($("#useModifiers").attr("checked") == "checked");
}


//Make input boxes for classes
function classBoxes()
{
    var n = parseInt($("#nClasses").val());
    var boxHtml = "<h3>Type in behaviors in each class as comma separated list</h3>";
    
    for (i=1; i<=n; i++)
    {
	boxHtml += "Class" +  i + " <input type='text' size='40'><br/>" ;
    }
    
    //If modifiers are used
    if (useModifiers())
    {
	boxHtml += "<div id='modifierInputs'> \
                   <h3>Type in behaviors with modifiers as comma separated list</h3>";
	boxHtml += "Behaviors with modifiers: <input type='text' size='40' id='modifiedClasses'><br/></div>" ;
    }


    boxHtml += "<p><button onclick='makeKeyInputs()'>Add keyboard shortcuts</button></p>"
    boxHtml += "<div id='keyInputs'></div>"

    boxHtml += "<p><button onclick='saveSettings()'>Save settings</button>"
    boxHtml += "<button onclick='openSettings()'>Open settings</button>"
    boxHtml += "<button onclick='enableSettings()'>Edit settings</button>"
    boxHtml += "<button onclick='clearSettings()'>Clear</button></p>"
    
    $("#classInputs").html(boxHtml)
}

function makeKeyInputs()
{
    allcodes = $("#classInputs > input").map(function(i, o){return o.value}).toArray().join().split(',')
    var codeHTML = "<p>Type in the keyboard shortcut for each \
behavior. (e.g. a, shift+a, alt+shift+k). If you want to use more than \
one modifier key (e.g. alt+ctrl+z) you should define them in  \
alphabetical order e.g. alt+ctrl+shift. It is advisable not to use \
keys that are already in use by the browser e.g. ctrl+f, ctrl+l, alt+f, alt+s.</p>";
    
    for (i = 0; i < allcodes.length; i++)
    {
	codeHTML += "<input type='text' size='5'/>" + allcodes[i] + "<BR/>"
    }

    $("#keyInputs").html(codeHTML)
}

function getKeyCodes()
{
    return $("#keyInputs > input").map(
	function(i,x){return x.value}).toArray();
}


//Save settings to file using php script on server
function saveSettings()
{
    //var projSettings = 
     storeSettings();
    
    //Save setting as text
    if (navigator.onLine)
    {
	exportData(JSON.stringify(projSettings, null, " "), projSettings.name + '_CowLogSettings.json');
    }
    else
    {
	var v = window.open('', 'config', '');
	v.document.write("<pre>" + JSON.stringify(projSettings, null, " ")  + "</pre>")
    }
}

//Open settings JSON in new window
function openSettings()
{
    //var projSettings = 
    storeSettings();
    
    var v = window.open('', 'config', '');
    v.document.write("<pre>" + JSON.stringify(projSettings, null, " ")  + "</pre>");
}

//Save classes from code and create buttons
function storeSettings()
{
    var csvArray = $("#classInputs > input").map(function(i, o){return o.value}).toArray();
    var codeArray = csvArray.map(function(x){return x.split(',')})
    modifierArray = null;
    var modifiers = useModifiers();
    var keyCodes = getKeyCodes();


    if (modifiers)
    {
	modifierArray = $("#modifiedClasses").val().split(',');
    }
    
    //Clear buttons
    //$("#buttonrow").html("")
    //Add new buttons
    //buttonHTML = codeArray.map(function(x){return codes2buttons(x)});
    //$("#buttonrow").html("<td>" +  buttonHTML.join('</td><td>') + "</td>");
    //setTimeout("resizePrefs()", 100)

    
   //Save setting to localStorage
    projSettings = 
	{
	    name : $("#projName").val(),
	    videoDirectory : $("#videoDir").val(),
	    author : $("#Author").val(),
	    nClasses : parseInt($("#nClasses").val()),
	    modifiers : modifiers,
	    codes : csvArray,
	    keyCodes : keyCodes,
	    modifiedCodes : modifierArray,
	    player : $("#player").val()
	}
    
    localStorage.setObject("savedProject_" + projSettings.name, projSettings);


    //Make buttons for coding
    makeButtons();
    //Bind shortcut keys
    bindKeys();

    getStoredProjects();
    disableSettings();
    //return(projSettings);
}



function disableSettings()
{
    //Disable options
    $("#projectprefs input").attr('disabled', 'disabled');
    $("#projectprefs  select").attr('disabled', 'disabled');
    
    //Re-enable loading
    $("#LoadSettings").children().removeAttr('disabled')

    //$("#classInputs > input").attr('disabled', 'disabled');
    //$("#Inputs > input").attr('disabled', 'disabled');
    //$("#Inputs > input").attr('disabled', 'disabled');
    //$("#modifierInputs > input").attr('disabled', 'disabled');
}

function enableSettings()
{
    $("#projectprefs input").removeAttr('disabled');
    $("#projectprefs select").removeAttr('disabled');
    //$("#classInputs > input").removeAttr('disabled');
    //$("#modifierInputs > input").removeAttr('disabled');
}

function clearSettings()
{
    $("#projectprefs input").removeAttr('disabled');
    $("#projectprefs input").val("");
    $("#classInputs").html("");
    $("#projectprefs > select").removeAttr('disabled');
    $("#modifierInputs > input").val("");
}


//Add buttons to UI based on project configuration
function makeButtons()
{
    var csvArray = $("#classInputs > input").map(function(i, o){return o.value}).toArray();
    var codeArray = csvArray.map(function(x){return x.split(',')})
    
    //Clear buttons
    $("#buttonrow").html("")
    //Add new buttons
    buttonHTML = codeArray.map(function(x){return codes2buttons(x)});
    $("#buttonrow").html("<td>" +  buttonHTML.join('</td><td>') + "</td>");

    var widths = $("#buttonrow > td > button").map(function(i, x){return x.clientWidth}).toArray();
    var maxWidth = widths.reduce(function(c, p){return Math.max(c,p)})
    console.log(maxWidth);
    $("button.codeButton").width(maxWidth);
    setTimeout("resizePrefs()", 100)
    setTimeout("resizeVideo()", 100)
}



function loadSettings()
{
    var project = $("#storedProjects").val();
    var config = localStorage.getObject(project);
    projSettings = config;
    $("#projName").val(config.name);
    $("#Author").val(config.author);
    $("#videoDir").val(config.videoDirectory);
    $("#nClasses").val(config.nClasses);
    $("#player").val(config.player);
    

    if (config.modifiers)
    {
	$("#useModifiers").attr("checked", "checked")
	modifierArray = config.modifiedCodes;
    }
    else
    {
	$("#useModifiers").removeAttr("checked")
    }

    classBoxes();
    
    inputs = $("#classInputs > input");
    
    for (i = 0; i< config.nClasses; i++)
    {
	inputs[i].value = config.codes[i];
    }
    
    if (config.modifiers)
    {
	$("#modifiedClasses").val(modifierArray.join(","));
    }

    makeButtons();
    
    //If config has keyboard shortcuts defined
    if (config.keyCodes.length > 0)
    {
	//Make inputs
	makeKeyInputs();
	var keyInputs = $("#keyInputs > input");
	//Fill in the values
	for (i in keyInputs)
	{
	    keyInputs[i].value = projSettings.keyCodes[i];
	}
	//Make the bindings
	bindKeys();
    }
    
    setTimeout("disableSettings()", 200);
}

//Read project settings from file
function loadSettingsFile(evt)
{
    var files = evt.target.files;
    input = new FileReader();
    input.readAsText(files[0]);
    input.onload =  LoadEvent;
    //alert(files[0].name);
}

//Settings read event
function LoadEvent(e)
{
    var text = input.result;
    //console.log(text);
    var projSettings = JSON.parse(text);
    //Save to localstorage
    localStorage.setObject("savedProject_" + projSettings.name, projSettings);
    //Update project selector
    getStoredProjects();
    //Set to imported and load it
    $("#storedProjects").val("savedProject_" + projSettings.name);
    loadSettings();
}


//Get loadable projects from 
function getStoredProjects()
{
    var stored = localStorage;
    var projects = [];
    for (key in stored)
    {
	if (key.match("savedProject_") != null && key != "savedProject_")
	{
	    projects.push(key)
	}
    }
    
    if (projects.length == 0)
    {
	//$("#LoadSettings").append("<em>No saved projects</em>");
    }
    else
    {
	var phtml = projects.map(function(x){return "<option value='" + 
					 x +
					"'>" + 
					x.replace('savedProject_', '') + 
					"</option>"})
	$("#storedProjects").html(phtml.join(''));
	console.log(phtml.join(''));
	
    }
}





//Make an array of buttons
function codes2buttons(codes)
{
    var buttons = codes.map(function(x){return "<button onclick='code(this)' class='codeButton'>" + x + "</button><BR/>"})
    return buttons.join('');
}

//Set end get objects to localstorage 
// http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

function exportData(data, filename){
//Export results to text files
//http://stackoverflow.com/questions/921037/jquery-table-to-csv-export
    if (navigator.onLine)
    {
	
	$("body").append(
	    "<form id='exportform' \
action='http://run.cowlog.org/export.php' method='post'> \
<input type='hidden' id='exportData' name='exportdata'/> \
<input type='hidden' id='exportFile' name='exportfile'/> \
</form>");
	
	$("#exportData").val(data);
	$("#exportFile").val(filename);
	$("#exportform").submit().remove();
    }
    else
    {
	alert("You seem to be offline, can't process request");

    }
}


function bindKeys()
{
    
    var n = projSettings.keyCodes.length; 
    //If we have some keys to bind...
    if (n > 0)
    {
	//Put behaviors to one array
	var codes = projSettings.codes.join().split(',');
	var keys = projSettings.keyCodes;
	
	for (i =0; i < n; i++)
	{
	    if (keys[i] !== "")
	    {
		bindButton(keys[i], codes[i]);
		console.log("Bound " + keys[i] + " to " + codes[i]);
	    }
	}
	
    }
}

//Bind a coding button to a key
function bindButton(keys, content)
{
    //Find an element with specified content
    var bButton = $('#buttonrow button').filter(function(){return($(this).html() == content)});
    $(document).bind('keydown', keys, function(){bButton.click()});
}
