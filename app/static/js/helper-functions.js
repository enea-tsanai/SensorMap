// Generic helper scripts are held here
// Overall goal, combine this and extraneous JS with google-maps.js 

//General JQuery to toggle display of information windows
$(document).ready(function(){
    $(".btn-toggle").click(function(){
        $(".front-panels-wrapper").toggle();
    });

    $('#itable').DataTable();

});
