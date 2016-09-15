var pageheader = $("#page-header")[0]; 
var pagecontainer = $("#page-container")[0]; 
var imgSelector = $("#my-file-selector"); 
//var refreshbtn = $("#refreshbtn"); 


function processImage(callback) {
    var file = imgSelector.get(0).files[0]; 
     var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file); 
    }
    else {
        console.log("Invalid file");
    }
    reader.onloadend = function () {
    
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            pageheader.innerHTML = "Please upload an image file (jpg or png).";
        }
        else {
        
            callback(file);
        }
    };
}



function changeUI(cap) {
    //Show detected mood
    pageheader.innerHTML = "" + cap 

}



    function sendRequest(file, callback) {
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
            if (data.description.length != 0) { 
                
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
    pageheader.innerHTML = "Analysing the Image..."; 
    processImage(function (file) { 
	
        sendRequest(file, function (capp) { 

            changeUI(capp); 

            //Done!!
        });
    });
});