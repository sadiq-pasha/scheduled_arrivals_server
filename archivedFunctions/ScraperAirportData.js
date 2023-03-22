// module imports
const cheerio = require('cheerio')
const axios = require('axios')

async function performScrapingAirportData(tailNumber) {
  // Fetching webpage from airport-data.com 
  try{
    const axiosResponse = await axios.request({
      method: 'GET',
      url: `https://www.airport-data.com/aircraft/${tailNumber}.html`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      }
    })
  
    //   parsing the HTML source of the target web page with Cheerio
    const $ = cheerio.load(axiosResponse.data)

    //   const $ = cheerio.load(`
    //         <!DOCTYPE html>
    //         <html lang="en">
    //         <head>
    //         <!-- Global site tag (gtag.js) - Google Analytics -->
    //         <script async src="https://www.googletagmanager.com/gtag/js?id=UA-123801-2"></script>
    //         <script>
    //           window.dataLayer = window.dataLayer || [];
    //           function gtag(){dataLayer.push(arguments);}
    //           gtag('js', new Date());
  
    //           gtag('config', 'UA-123801-2');
    //         </script>
    //         <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    //         <META NAME="Keywords" CONTENT="EI-EJM, 2012 Airbus A330-202 C/N 1308, aircraft data, aircraft photo, airplane picture ">
    //         <meta name="DESCRIPTION" content="Everything you need to know about EI-EJM (2012 Airbus A330-202 C/N 1308) including aircraft data, history and photos">
    //         <meta name=viewport content="width=1024, initial-scale=1">
    //         <title>Aircraft Data EI-EJM, 2012 Airbus A330-202 C/N 1308</title>
    //         <script language="javascript">if (parent.frames.length > 0) top.location.replace(document.location);</script>
    //         <link rel="canonical" href="https://www.airport-data.com/aircraft/EI-EJM.html" />
    //         <script src="https://code.jquery.com/jquery-1.12.4.min.js"  integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
    //         <script src="https://cdn.airport-data.com/js/airport-data.js?v=1305732968" type="text/javascript"></script>
   
    //             <link rel="stylesheet" href="https://cdn.airport-data.com/css/bootstrap/css/bootstrap.min.css?v=1388847586">
    //             <link rel="stylesheet" href="https://cdn.airport-data.com/css/main.css?v=1583664976">
    //         </head>
   
    //         <body topmargin="0">
    //         <a name="top"></a>
    //         <header>
    //             <div class="container">
    //                 <div class="row">
    //                     <div class="span20">
    //                         <a href="https://www.airport-data.com"><img src="https://cdn.airport-data.com/images/logo.png?v=1403354238" border="0" title="Airport-Data.com" alt="Airport-Data.com"></a>
    //                     </div>
    //                     <div class="span10 offset1">
    //                         <div class="pull-right top-margin-10">
    //                             <div class="header-blocks">			
    //         <a href="/forums/login.php">Log in</a>&nbsp; &nbsp;
    //                   New user?&nbsp; <a href="/forums/profile.php?mode=register">Sign up for free</a>        
    //                             </div>
    //                             <div class="header-blocks">
    //                                             <a href="/tell_a_friend.php?url=https://www.airport-data.com/aircraft/EI-EJM.html">Tell a Friend</a>
    //                             </div>
    //                         </div>  <!-- pull-right -->
    //                     </div>
    //                 </div> <!-- row -->
    //                 <div class="navbar navbar-static-top">
    //                     <div class="navbar-inner">
    //                             <ul class="nav">
    //                                 <li><a href="/">Home</a></li>
    //                                 <li class="dropdown">
    //                                     <a id="dropAirport" href="#" class="dropdown-toggle" data-toggle="dropdown">Airport <b class="caret"></b></a>
    //                                     <ul class="dropdown-menu" role="menu" aria-labelledby="dropAirport">
    //                                         <li><a href="/usa-airports/state/">USA Airports</a></li>
    //                                         <li><a href="/usa-airports/search.php">Search USA Airports</a></li>
    //                                         <li class="divider"></li>
    //                                         <li><a href="/world-airports/countries/">World Airports</a></li>
    //                                         <li><a href="/world-airports/search.php">Search World Airports</a></li>
    //                                         <li class="divider"></li>			
    //                                         <li><a href="/airport/upload.php">Upload Airport Photo</a></li>
    //                                         <li><a href="/airport/random_photos.html">Random Airport Photos</a></li>
    //                                         <li><a href="/airport/just_uploaded_photos.html">Recent Airport Photos</a></li>
    //                                     </ul>
    //                                 </li>
    //                                 <li class="dropdown">
    //                                     <a id="dropAircraft" href="#" class="dropdown-toggle" data-toggle="dropdown">Aircraft <b class="caret"></b></a>
    //                                     <ul class="dropdown-menu" role="menu" aria-labelledby="dropAircraft">
    //                                         <li><a href="/search/">Search Aircraft & Photo</a></li>
    //                                         <li><a href="/manuf/A.html">Browse by Manufacturer</a></li>
    //                                         <li><a href="/aircraft/add_aircraft_step1.html">Add New Aircraft</a></li>
    //                                         <li class="divider"></li>								
    //                                         <li><a href="/aircraft/upload.php">Upload Aircraft Photo</a></li>
    //                                         <li><a href="/aircraft/random_photos.html">Random Aircraft Photos</a></li>
    //                                         <li><a href="/aircraft/just_uploaded_photos.html">Recent Aircraft Photos</a></li>
    //                                     </ul>
    //                                 </li>
    //                                 <li><a href="/photographers/">Photographers</a></li>
    //                                 <li><a href="/slideshows/">Slideshows</a></li>
    //                                 <li><a href="/articles/">Articles</a></li>
    //                                 <li><a href="/forums/">Forums</a></li>
    //                                 <li><a href="/member/">Member Section</a></li>
    //                                 <li><a href="/api/doc.php">API</a></li>
    //                                                     </ul>
    //                     </div> <!-- navbar-inner -->
    //                 </div> <!-- navbar -->
    //             </div> <!-- container -->
    //         </header>	
    //         <div class="container">
    //         <script language="javascript">
    //         $(function() {
    //             // relink ac photo
    //             // bind action to relink function links
    //             $('.toggle-relink').bind('click', function() {
    //                 var ajax_link = $(this).attr('data-remote');
    //                 $('#relink').removeData('modal')
    //                             .modal({ remote: ajax_link });
    //                 $('#submit').show();
    //             });
  
    //             // reload page after successful relink
    //             $('#relink').on('hidden', function() {
    //                 if ( relink_succeed ) location.reload();
    //             });
      
    //             var relink_succeed = 0;		
    //             // relink onClick event
    //             $("#submit").click(function() {
    //                 // get list of existing airframes matching manufacturer and model
    //                 $.getJSON('https://www.airport-data.com/aircraft/ajax_relink_ac_photo.php', 
    //                     { tail: $("#tail").val(), 
    //                       acpid: $("#acpid").val(),
    //                       aircraft_id: $("#aircraft_id").val(),
    //                       AJAX: 1, submit: 1},
    //                     function(data) {
    //                         //new_url = "https://www.airport-data.com/aircraft/" + $("#tail").val() + ".html" + "#aircraft" + $("#aircraft_id").val();
    //                         // hide submit button
    //                         $('#submit').hide();
    //                         // display result
    //                         if ( data.code == 0 ) {
    //                             $('#relink').removeData('modal');
    //                             $('#relink > .modal-body').html('<div class="overlay_error_msg"><div class="overlay_msg_txt">' + data.message + '</div></div>');
    //                             $('#relink').modal();
                      
    //                             relink_succeed = 0;						
    //                         } else {
    //                             $('#relink').removeData('modal');
    //                             $('#relink > .modal-body').html('<div class="overlay_confirm_msg"><div class="overlay_msg_txt">' + data.message + '</div></div>');
    //                             $('#relink').modal();
                      
    //                             relink_succeed = 1;
    //                         }
    //                     });
    //             });		
  
    //             // bind action to comment function links
    //             $('.toggle-comment').bind('click', function() {
    //                 var ajax_link = $(this).attr('data-remote');
    //                 $('#ac_ticket_comment').removeData('modal')
    //                             .modal({ remote: ajax_link });
    //                 $('#submit_ticket').show();
    //             });	
          
    //             var ac_ticket_comment_succeed = 0;		
    //             // ac_ticket_comment onClick event
    //             $("#submit_ticket").click(function() {
    //                 if ($("input:radio:checked").val() == null) {
    //                     alert("Submit Type is required");
    //                     return false;
    //                 }
    //                 if ($("#name").val() == '') {
    //                     alert("Name is required");
    //                     $("#name").focus();
    //                     return false;
    //                 }			
    //                 if ($("#email").val() == '') {
    //                     alert("Email is required");
    //                     $("#email").focus();				
    //                     return false;
    //                 }			
    //                 if ($("#comment").val() == '') {
    //                     alert("Comment is required");
    //                     $("#comment").focus();				
    //                     return false;
    //                 }
    //                 // get list of existing airframes matching manufacturer and model
    //                 $.getJSON('https://www.airport-data.com/aircraft/ajax_ac_ticket_comment.php', 
    //                     { acid: $("#acid").val(),
    //                       submit_type: $("input:radio:checked").val(),
    //                       name: $("#name").val(),
    //                       email: $("#email").val(),
    //                       comment: $("#comment").val(),
    //                       AJAX: 1, submit: 1},
    //                     function(data) {
    //                         // hide submit button
    //                         $('#submit_ticket').hide();
    //                         // display result
    //                         if ( data.code == 0 ) {
    //                             $('#ac_ticket_comment').removeData('modal');
    //                             $('#ac_ticket_comment > .modal-body').html('<div class="overlay_error_msg"><div class="overlay_msg_txt">' + data.message + '</div></div>');
    //                             $('#ac_ticket_comment').modal();
                      
    //                             ac_ticket_comment_succeed = 0;						
    //                         } else {
    //                             $('#ac_ticket_comment').removeData('modal');
    //                             $('#ac_ticket_comment > .modal-body').html('<div class="overlay_confirm_msg"><div class="overlay_msg_txt">' + data.message + '</div></div>');
    //                             $('#ac_ticket_comment').modal();
                      
    //                             ac_ticket_comment_succeed = 1;
    //                         }
    //                     });
    //             });			
      
    //         });	
    //         </script>
    //                 <!-- Modal -->
    //                 <!-- relink_ac_photo overlay -->
    //                 <div id="relink" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="relinkLabel" aria-hidden="true">
    //                     <div class="modal-header">
    //                         <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    //                         <h3 id="relinkLabel">Relink photo to another aircraft</h3>
    //                     </div>
    //                     <div class="modal-body">
    //                     </div>
    //                     <div class="modal-footer">
    //                         <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
    //                         <button id="submit" class="btn btn-primary">Correct Photo</button>
    //                     </div>
    //                 </div>
      
    //                 <!-- aircraft ticket/comment -->
    //                 <div id="ac_ticket_comment" class="modal hide fade large" tabindex="-1" role="dialog" aria-labelledby="commentLabel" aria-hidden="true">
    //                     <div class="modal-header">
    //                         <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    //                         <h3 id="commentLabel">Comment on Aircraft</h3>
    //                     </div>
    //                     <div class="modal-body">
    //                     </div>
    //                     <div class="modal-footer">
    //                         <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
    //                         <button id="submit_ticket" class="btn btn-primary">Submit Comment</button>
    //                     </div>
    //                 </div>
    //                 <!-- end of overlay -->
  
    //             <h1 class="center">Aircraft EI-EJM Data</h1>
    //             <div style="text-align:center;margin: 10px 0;">
    //                 <h4 class="center"><a href="https://www.airport-data.com/manuf/A.html">Browse by Manufacturer</a></h4>
    //             </div>
    //             <div class="row">
    //                 <div class="span9">
    //             <!-- page navigator and ad-->
    //                 <div class="ac_info_left">
    //         <div class="ac_info_title"><div style="padding: 8px;">1 aircraft record found.</div></div><div class="ac_info_nav"><a href="#aircraft789338">2012 Airbus A330-202</a></div>	
    //                 <div class="ac_info_nav"><a href="/aircraft/add_aircraft_step1.php?tail=EI-EJM">Add another EI-EJM</a></div>
    //         <div class="ac_info_nav">&nbsp;</div><div class="ac_info_250_250"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    //         <!-- Square Resp. aircraft profiles -->
    //         <ins class="adsbygoogle"
    //              style="display:block"
    //              data-ad-client="ca-pub-1863651256294685"
    //              data-ad-slot="3250685167"
    //              data-ad-format="auto"
    //              data-full-width-responsive="true"></ins>
    //         <script>
    //              (adsbygoogle = window.adsbygoogle || []).push({});
    //         </script></div>			</div>
    //                 </div>  <!-- span -->
    //                 <div class="span24">
    //             <!-- main content -->
      
    //                 <div style="border: solid 0px #CCCCCC;">	
    //                     <a name="aircraft789338"></a> 
    //                     <div class="ac_info_title">
    //                         <table border="0" width="100%" cellspacing="0" cellpadding="0">
    //                             <tr><td>
    //                                     <div class="huge_id">EI-EJM</div>
    //                                     <div class="small_id">Giovanni Battista Tiepolo</div>			
    //                                 </td>
    //                                 <td>
    //                                     <H4 style="font-size: 14px; color: #000; margin-top: 0px;">2012 Airbus A330-202 C/N 1308</H4>
    //                                     <small><a href="https://www.airport-data.com/forums/posting.php?mode=newtopic&f=6&tail=EI-EJM">Discuss this aircraft in forum</a></small>
    //                             </td></tr>
    //                         </table>
    //                     </div>
    //                     <div style="clear:both;"></div>
    //                     <div style="background-color: #FFF0F0">
    //                         <div class="ac_info_link">
    //                                 <div><a href="https://www.airport-data.com/aircraft/upload.php?acid=789338">Have a photo of this aircraft? Share with others.</a></div>
    //                                 <div><a href="https://www.airport-data.com/aircraft/update.html?acid=789338">Correct or submit additional aircraft data</a></div>
    //                                 <!-- link to show modal -->
    //                                 <div><a href="#ac_ticket_comment" role="button" class="toggle-comment" data-remote="https://www.airport-data.com/aircraft/ajax_ac_ticket_comment.php?acid=789338">Comment on this aircraft</a></div>
    //                                 <!-- link to show modal -->
    //                                 <div><a href="#linkbox0" role="button" data-toggle="modal">Links to this page and other related pages</a></div>
    //                                 <!-- aircraft links modal -->
    //                                 <div id="linkbox0" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="labelLinkbox0" aria-hidden="true">
    //                                     <div class="modal-header">
    //                                         <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    //                                         <h3 id="labelLinkbox0">Links to this page</h3>
    //                                     </div>
    //                                     <div class="modal-body">
  
    //                                      <h5>Link to aircraft EI-EJM data (this page):</h5>
    //                                      <code>https://www.airport-data.com/aircraft/EI-EJM.html</code>
    //                                      <h5>Link to all aircraft made by Airbus</h5>
    //                                      <code><a href="https://www.airport-data.com/manuf/Airbus.html">https://www.airport-data.com/manuf/Airbus.html</a></code>
    //                                      <h5>Link to all aircraft of the same model (Airbus A330-202)</h5>
    //                                      <code><a href="https://www.airport-data.com/search/search2.html?field=model&search=Search&code=Airbus+A330-202">https://www.airport-data.com/search/search2.html?field=model&search=Search&code=Airbus+A330-202</a></code>            
    //                                     </div>
    //                                     <div class="modal-footer">
    //                                         <a class="btn" data-dismiss="modal" aria-hidden="true">Close</a>
    //                                     </div>
    //                                 </div>
    //                         </div>
    //                         <div style="clear:both;"></div>
    //         </div>		<div style="float:right; padding: 7px; font-size: 14px; font-weight: bold">Total 13 photos. <a href="https://www.airport-data.com/aircraft/photos/EI-EJM:789338:1.html">View all photos</a></div>
    //                 <div class="ac_info_sec_title">Latest photos of EI-EJM</div>
    //                     <ul class="thumbnails">
      
    //                 <li class="span6">
    //                     <a class="thumbnail" href="/aircraft/photo/001739770.html">
    //                         <img src="/images/aircraft/thumbnails/001/739/001739770.jpg" width="150" title="EI-EJM @ KMIA - Alitalia A332 zx - by Florida Metal" alt="EI-EJM @ KMIA - Alitalia A332 zx - by Florida Metal">
    //                     </a>
    //                     <small>by Florida Metal&nbsp;@&nbsp;KMIA</small>
                  
    //                 </li>
      
    //                 <li class="span6">
    //                     <a class="thumbnail" href="/aircraft/photo/001453532.html">
    //                         <img src="/images/aircraft/thumbnails/001/453/001453532.jpg" width="150" title="EI-EJM @ FAJS - At O.R. Tambo - by Micha Lueck" alt="EI-EJM @ FAJS - At O.R. Tambo - by Micha Lueck">
    //                     </a>
    //                     <small>by Micha Lueck&nbsp;@&nbsp;FAJS</small>
                  
    //                 </li>
      
    //                 <li class="span6">
    //                     <a class="thumbnail" href="/aircraft/photo/001386936.html">
    //                         <img src="/images/aircraft/thumbnails/001/386/001386936.jpg" width="150" title="EI-EJM @ LFBD - Alitalia A330, special flight from Pointe-à-Pitre to Milan via Bordeaux. - by Arthur CHI YEN" alt="EI-EJM @ LFBD - Alitalia A330, special flight from Pointe-à-Pitre to Milan via Bordeaux. - by Arthur CHI YEN">
    //                     </a>
    //                     <small>by Arthur CHI YEN&nbsp;@&nbsp;LFBD</small>
                  
    //                 </li>
      
    //                 <li class="span6">
    //                     <a class="thumbnail" href="/aircraft/photo/001386935.html">
    //                         <img src="/images/aircraft/thumbnails/001/386/001386935.jpg" width="150" title="EI-EJM @ LFBD - Alitalia A330, special flight from Pointe-à-Pitre to Milan via Bordeaux. - by Arthur CHI YEN" alt="EI-EJM @ LFBD - Alitalia A330, special flight from Pointe-à-Pitre to Milan via Bordeaux. - by Arthur CHI YEN">
    //                     </a>
    //                     <small>by Arthur CHI YEN&nbsp;@&nbsp;LFBD</small>
                  
    //                 </li>
      
    //                     </ul>
      
    //             <div class="ac_info_sec_body">
    //                 <h3>Airframe Info</h3>
    //                 <table class="table table-striped table-condensed">
    //             <tr><td class="span10 ac_property_title" width="240" ><b>Manufacturer:</b></td><td width="500" ><a href="https://www.airport-data.com/manuf/Airbus.html">Airbus</a></td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Model:</b></td><td>A330-202&nbsp; &nbsp; <a href="https://www.airport-data.com/search/search2.html?field=model&search=Search&code=Airbus+A330-202">Search all Airbus A330-202</a></td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Year built:</b></td><td>2012</td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Construction Number (C/N):</b></td><td>1308</td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Aircraft Type:</b></td><td>Fixed wing multi engine</td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Number of Seats:</b></td><td>N/A</td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Number of Engines:</b></td><td>2</td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Engine Type:</b></td><td>Turbofan</td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Engine Manufacturer and Model:</b></td><td>General Electric CF6-80E1A4</td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Also Registered As:</b></td><td><div style="line-height: 18px"><a href="/aircraft/F-WWKH.html">F-WWKH</a>&nbsp; <i>Test Registered</i>&nbsp; <i>Delivery: 2012-00-00</i><br/>
    //         </div></td></tr>
    //                 </table>
  
    //                  <a name="status"></a>
    //                 <h3>Aircraft</h3>
    //                 <table class="table table-striped table-condensed">
    //             <tr><td class="span10 ac_property_title" width="240" ><b>Registration Number:</b></td><td width="500" >EI-EJM</td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Alternative Code/Name:</b></td><td>Giovanni Battista Tiepolo</td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Mode S (ICAO24) Code:</b></td><td>4CAA32</td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Current Status:</b></td><td>Registered</td></tr>
    //             <tr><td class="span10 ac_property_title" ><b>Delivery Date:</b></td><td>2012-05-14</td></tr>
    //                 </table>
  
    //                 <a name="owner"></a>
    //                 <h3>Owner</h3>
    //                 <table class="table table-striped table-condensed">
    //             <tr><td class="span10 ac_property_title" width="240" ><b>Owner:</b></td><td width="500" >Alitalia</td></tr>
    //             <tr><td class="span10 ac_property_title" width="240" ><b>Address:</b></td><td width="500" >IFSC<br>Dublin 1,  <br>Ireland</td></tr>
    //                 </table>	    
  
    //                     <!-- main section -->
    //                 </div><!-- ac_info_sec_body -->
    //             </div><!-- end of each aircraft record -->
      
    //                 </div>  <!-- span -->
    //             </div>  <!-- row -->
    //         </div> <!-- container -->
    //         <!-- back to top -->
    //         <span class="backTop" title="Back to Top"></span>
    //         <footer class="footer">
    //             <div class="container">
    //                 <div class="row">
    //                     <div class="span1"></div>
    //                     <div class="span7">
    //                         <h5>Airport</h5>
    //                         <ul class="unstyled">
    //                             <li><a href="/usa-airports/state/">USA Airports</a></li>
    //                             <li><a href="/usa-airports/search.php">Search USA Airports</a></li>
    //                             <li><a href="/airport-finder.html">USA Airport Finder</a></li>
    //                             <li><a href="/world-airports/countries/">World Airports</a></li>
    //                             <li><a href="/world-airports/search.php">Search World Airports</a></li>
    //                             <li><a href="/airport/upload.php">Upload Airport Photo</a></li>
    //                             <li><a href="/airport/random_photos.html">Random Airport Photos</a></li>
    //                             <li><a href="/airport/just_uploaded_photos.html">Recent Airport Photos</a></li>
    //                         </ul>
    //                     </div> <!-- span -->
    //                     <div class="span7">
    //                         <h5>Aircraft</h5>
    //                         <ul class="unstyled">
    //                             <li><a href="/search/">Search Aircraft & Photo</a></li>
    //                             <li><a href="/manuf/A.html">Browse by Manufacturer</a></li>
    //                             <li><a href="/aircraft/add_aircraft_step1.html">Add New Aircraft</a></li>
    //                             <li><a href="/aircraft/upload.php">Upload Aircraft Photo</a></li>
    //                             <li><a href="/aircraft/random_photos.html">Random Aircraft Photos</a></li>
    //                             <li><a href="/aircraft/just_uploaded_photos.html">Recent Aircraft Photos</a></li>
    //                         </ul>
    //                     </div> <!-- span -->				
    //                     <div class="span6">
    //                         <h5>Contents</h5>
    //                         <ul class="unstyled">
    //                             <li><a href="/member/">Member Section</a></li>
    //                             <li><a href="/forums/">Forums</a></li>
    //                             <li><a href="/slideshows/">Slideshows</a></li>
    //                             <li><a href="/photographers/">Photographers</a></li>
    //                             <li><a href="/articles/">Articles</a></li>
    //                             <li><a href="/past_logos/">Past Logos</a></li>
    //                             <li><a href="/api/doc.php">API</a></li>
    //                         </ul>
    //                     </div> <!-- span -->
    //                     <div class="span6">
    //                         <h5>Quick Links</h5>
    //                         <ul class="unstyled">
    //                             <li><a href="/forums/login.php">Log in</a></li>
    //                             <li><a href="/forums/profile.php?mode=register">Sign up</a></li>					
    //                             <li><br></li>
    //                         </ul>
    //                     </div> <!-- span -->
    //                     <div class="span6">
    //                         <h5>About Us</h5>
    //                         <ul class="unstyled">
    //                             <li><a href="/about.html">About Us</a></li>
    //                             <li><a href="/privacy.html">Privacy Policy</a></li>
    //                             <li><a href="/disclaimer.html">Disclaimer</a></li>
    //                             <li><a href="/contact.html">Contact Us</a></li>
    //                             <li><a href="/advertising/">Advertising</a></li>
    //                         </ul>
    //                     </div> <!-- span6 -->				
    //                 </div> <!-- row -->
    //                 <div class="row">
    //                     <div class="span33 center">
                      
    //                     </div>
    //                 </div> <!-- row -->
    //                 <div class="row">
    //                     <div class="span33 footer-links center">
    //                         <p>Copyright 2004-2023, Airport-Data.com. All rights reserved. </p>
    //                         <p>Airport-Data.com does not guarantee the accuracy or timeliness of any information on this site. Use at your own risk.</p>
    //                         <p class="text-error">Do NOT use these information for navigation, flight planning, or for use in flight.</p>
    //                     </div> <!-- span33 -->
    //                 </div> <!-- row -->
    //             </div> <!-- container -->
    //         </footer>	
    //         <script src="https://cdn.airport-data.com/js/bootstrap.min.js?v=1355090355" type="text/javascript"></script>
    //         <script src="https://cdn.airport-data.com/js/jquery.placeholder.js?v=1355456474" type="text/javascript"></script>
    //         <script src="https://cdn.airport-data.com/js/global.js?v=1385041458" type="text/javascript"></script>
    //         </body>
    //         </html>
  
    //         `)
  
    let scrapedAirframeData = []
    const airframeData = {}

    // scrap table containing airframe data
    $('.ac_info_sec_body > table > tbody > tr').each((index, element) => {
      scrapedAirframeData.push($(element).text())
    })

    // split the data, trim it, and remove anchor tag text
    scrapedAirframeData = scrapedAirframeData
      .map(data => data.split(':',2))
      .map(dataSubArray => {
        return dataSubArray.map(dataString => {
          if (dataString.includes('Search')){
            return dataString.split('Search',1)[0].trim()
          }
          return dataString.trim()
        })
      })
      .map(value => airframeData[value[0]] = value[1])
  
    // console.log(airframeData)
    return(airframeData)
  }
  catch(error) {
    // console.log(error)
    return {}
  }

}
// performScrapingAirportData()

// module export
exports.performScrapingAirportData = performScrapingAirportData

// successful scraped return example
// [
//     'Manufacturer:Airbus',
//     'Model:A330-202    Search all Airbus A330-202',
//     'Year built:2012',
//     'Construction Number (C/N):1308',
//     'Aircraft Type:Fixed wing multi engine',
//     'Number of Seats:N/A',
//     'Number of Engines:2',
//     'Engine Type:Turbofan',
//     'Engine Manufacturer and Model:General Electric CF6-80E1A4',
//     'Also Registered As:F-WWKH  Test Registered  Delivery: 2012-00-00\n      ',
//     'Registration Number:EI-EJM',
//     'Alternative Code/Name:Giovanni Battista Tiepolo',
//     'Mode S (ICAO24) Code:4CAA32',
//     'Current Status:Registered',
//     'Delivery Date:2012-05-14',
//     'Owner:Alitalia',
//     'Address:IFSCDublin 1,  Ireland'
//   ]