var pageheader = $("#page-header")[0]; //note the [0], jQuery returns an object, so to get the html DOM object we need the first item in the object
var pagecontainer = $("#page-container")[0]; 
var imgSelector = $("#my-file-selector"); //You dont have to use [0], however this just means whenever you use the object you need to refer to it with [0].
//var refreshbtn = $("#refreshbtn"); 


function processImage(callback) : void{
    var file = imgSelector.get(0).files[0]; //get(0) is required as imgSelector is a jQuery object so to get the DOM object, its the first item in the object. files[0] refers to the location of the photo we just chose.
     var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file); //used to read the contents of the file
    }
    else {
        console.log("Invalid file");
    }
    reader.onloadend = function () {
        //After loading the file it checks if extension is jpg or png and if it isnt it lets the user know.
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            pageheader.innerHTML = "Please upload an image file (jpg or png).";
        }
        else {
            //if file is photo it sends the file reference back up
            callback(file);
        }
    };
}



function changeUI(cap) {
    //Show detected mood
    pageheader.innerHTML = "" + cap 

}



    function sendEmotionRequest(file, callback): void {
    $.ajax({
        url: "https://api.projectoxford.ai/vision/v1.0/describe?maxCandidates=1",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "53f2445939dc4e94ba6eaabcdbe37801");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (data) {
            if (data.description.length != 0) { // if a face is detected
                
                var cap = data.description.captions[0].text;
                callback(cap);
            } else {
                pageheader.innerHTML = "some. Try another?";
            }
        })
        .fail(function (error) {
            pageheader.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
            console.log(error.getAllResponseHeaders());
        });
}
imgSelector.on("change", function () {
    pageheader.innerHTML = "Analysing the Image"; //good to let your user know something is happening!
    processImage(function (file) { //this checks the extension and file
	
        sendEmotionRequest(file, function (capp) { //here we send the API request and get the response

            changeUI(capp); //time to update the web app, with their emotion!

            //Done!!
        });
    });
});