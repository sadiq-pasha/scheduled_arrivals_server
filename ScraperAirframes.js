// Last resort scraping for airframe data, if data not found using FlightLabs airplane API

const cheerio = require('cheerio')
const axios = require('axios')

async function performScrapingAirFrames(tailNumber) {
  //   Fetching webpage from airframes.org
  try {
    const axiosResponse = await axios.request({
      method: 'GET',
      url: `http://www.airframes.org/reg/${tailNumber}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Cookie': 'PHPSESSID=9ahb03tkkinb5ejsk2jjaihcs2; afc1=5a813657a813'
      }
    })
    //   console.log(axiosResponse.data)
 
    // parsing the HTML source of the target web page with Cheerio
    const $ = cheerio.load(axiosResponse.data)

    // sample axios response data
    //   const $ = cheerio.load(`
    //   <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    //  <html lang="en">
    //  <head>
    //  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    //  <meta http-equiv="Content-language" content="en">
    //  <meta http-equiv="expires" content="0">
    //  <meta http-equiv="Content-Style-Type" content="text/css">
    //  <link rev="made" href="http://www.airframes.org/">
    //  <title>AIRFRAMES.ORG - Aircraft Database - TCLGI</title>
    //  <meta name="description" content="AIRFRAMES.ORG - online database to lookup aircraft registry information on airframe TCLGI and other data like ICAO24 ADS-B or mode-S SSR transponder code, SELCAL, operating airline  with ICAO24 codes as seen on SBS-1 BaseStation or RadarBox">
    //  <meta name="keywords" content="airframes aircraft registry database online airline airlines radar lookup selcal icao24 ICAO 24bit address ADS-B mode-s airline fleet operator callsign history sbs-1 BaseStation radarbox TCLGI ">
    //  <meta name="author" content="airframes.org">
    //  <meta name="copyright" content="airframes.org">
    //  <meta name="generator" content="airframes.org">
    //  <meta name="robots" content="INDEX, FOLLOW, NOARCHIVE, NOSNIPPET">
    //  <meta name="rating" content="General">
    //  <meta name="MSSmartTagsPreventParsing" content="TRUE">
    //  <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //  <link rel="stylesheet" type="text/css" title="Default Stylesheet" href="/style1.css">
    //  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    //  <base target="_top">
    //  </head>
 
    //  <!-- (C)2005-2007, airframes.org  - - - - - - - - - - - - - - - - - - - -->
 
    //  <body>
    //  <div id="container">
 
    //  <div id="top">
    //  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="no">
    //    <tr>
    //      <td align="left" valign="top" class="no">
    //        <a href="http://www.airframes.org/"><img src="/images/airframes.jpg" width="450" height="60" border="0" alt="airframes"></a>
    //      </td>
 
    //      <td width="2" class="no"><a href="/special99/"><img src="/images/airpx1.gif" border="0" alt=" " width="1" height="1" /></a>    </td>
 
    //      <td width="470" valign="top" align="right" class="no">
    //            </td>
    //    </tr>
    //  </table>
 
    //  <hr size="1" align="left">
    //  </div>
 
    //  <div id="leftnav">
    //  <br>
    //  <a href="http://www.airframes.org/"><strong>Airframes.org</strong></a> <br>
    //  <a href="http://www.airframes.org/">Aircraft </a> <br>
    //  <a href="http://www.airframes.org/airlines/">Airlines</a> <br>
    //  <br />
    //  <a href="http://www.airframes.org/information.php">Information</a> <br>
    //  <a href="http://www.airframes.org/files/">Files</a> <br>
    //  <a href="http://www.airframes.org/resources.php">Resources</a> <br>
    //  <br />
    //  <a href="http://www.airframes.org/addinfo.php">About this DB</a> <br>
    //  <a href="http://www.airframes.org/new.php">News</a> <br>
    //  <a href="http://www.airframes.org/faq.php">FAQ</a> <br>
    //  <a href="http://www.airframes.org/supporters.php">Supporters</a> <br>
    //  <br>
    //  <small>Logged in as:<br>raFFe </small><br><a href="http://www.airframes.org/logout"><b>logout</b></a> <br><br>
 
    //  <small>Support this site:</small>
    //  <form action="https://www.paypal.com/cgi-bin/webscr" method="post">
    //  <input type="hidden" name="cmd" value="_xclick">
    //  <input type="hidden" name="business" value="r405@kloth.net">
    //  <input type="hidden" name="item_name" value="Your friendly donation to keep AIRFRAMES.ORG running">
    //  <input type="hidden" name="page_style" value="Airframes_org">
    //  <input type="hidden" name="no_shipping" value="1">
    //  <input type="hidden" name="return" value="http://www.airframes.org/addinfo.php">
    //  <input type="hidden" name="cancel_return" value="http://www.airframes.org/addinfo.php">
    //  <input type="hidden" name="no_note" value="1">
    //  <input type="hidden" name="amount" value="10.00">
    //  <input type="hidden" name="currency_code" value="EUR">
    //  <input type="hidden" name="tax" value="0">
    //  <input type="hidden" name="lc" value="GB">
    //  <input type="image" src="/images/x-click-but04.gif" border="0" name="submit" alt="Make payments with PayPal - it's fast, free and secure!"><br />
    //  </form>
 
    //  </div>
 
    //  <div id="content">
 
    //  <h1>Aircraft Registration Database Lookup</h1>
 
    //  <p class="small">Passenger airliners, cargo airplanes, business jets, helicopters, private aircraft, civil and military, 
    //  showing common registry data as well as mode-S radar transponder addresses.
    //  The database is still <strong>under development and construction.</strong></p>
 
    //    <form method="post" action="/">
    //      <fieldset>
    //        <legend> Aircraft database &nbsp; </legend>
    //        <table width="100%" class="no">
    //          <tr><td class="no">Registration:   </td><td class="no"><input type="text" name="reg1" value=""> </td><td class="no small">[e.g. D-AIXA or daixa]</td><td class="no" rowspan="4">&nbsp;</td>
    //            <td class="no" align="right" width="10%" rowspan="4">
    //   &nbsp; </td></tr>        
    //          <tr><td class="no">Selcal:         </td><td class="no"><input type="Text" name="selcal" value=""> </td><td class="no small">[e.g. AS-DR or asdr]</td></tr>
    //          <tr><td class="no">ICAO24 address: </td><td class="no"><input type="Text" name="ica024" value=""> </td><td class="no small">[Mode-S address, default hex, or <input type="radio" name="t" value ="D">dec <input type="radio" name="t" value ="O">oct <input type="radio" name="t" value ="B">bin]</td></tr>
    //          <tr><td class="no">&nbsp;          </td><td class="no"><input type="submit" name="submit" value="submit"> <input type="reset" name="reset" value="reset"> &nbsp; </td><td class="no small">... <a href="/nobots.php">no bots</a> ... &nbsp; </td></tr>
    //        </table>
    //      </fieldset>
    //    </form>
 
 
 
    //  <p class="small"> Your query for aircraft registration TCLGI. Result:  1 row.</p><table>
    //    <tr><th title="Registration">Registration</th><th title="Manufacturer">Manuf.</th>
    //                              <th title="airplane model">Model</th><th title="a/c type according to ICAO Doc 8643">Type</th><th title="construction number">c/n</th><th title="class according to ICAO Doc 8643">i/t</th><th> </th><th title="24bit address on mode-S and ADS-B">ICAO24</th><th> </th><th title="Registrant/Operating Airline">Reg&nbsp;/&nbsp;Opr</th><th>built</th>
    //                              <th>test reg</th><th>delivery</th><th title="p/i">prev.reg</th>
    //                              <th>until</th><th title="fate">next reg</th><th>status</th><th>&nbsp</th>
    //                              </tr>
    //      <tr ><td><a href="/reg/tclgi" target ="new">TC-LGI</a></td> <td>Airbus</td> <td>A350-941<b></b></td><td title=""><u></u>A359</td><td><i></i>457</td> <td title="Landplane, 2 jet engines">L2J</td> <td></td> <td > 4BB0E9</td><td></td><td><a href="/airlines/icao/thy" target ="new">THY</a> [TK] Turkish Airlines</td><td title="2021-10-26">2021</td><td>F-WZNJ</td><td>2022-07-08</td><td><a href="/reg/vpbxs" target ="new">VP-BXS</a></td><td title=""></td><td></td><td>active</td><td><a href="/amend.php?id=6e9a42ae4c44b5c36c6afc13e8830083" rel="nofollow" class="small">edit</a></td></tr>
    //  <tr><td colspan='2' class='s80' align='right'>Remarks:</td>
    //                              <td colspan='17'>2x RR Trent XWB-84 engines. </td></tr>
    //  </table>
    //  <br />
    //  </td></tr>
    //  </table>
 
 
    //  </div>
 
    //  <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
 
 
    //  <div id="footer">
    //  <br />
    //  <hr size="1" align="left">
    //  <p class="small">
    //  Document URL : <a href="http://www.airframes.org/reg/tclgi">http://www.airframes.org/reg/tclgi</a><br />
    //  Copyright &copy; 2005-2023 airframes.org. &lt;<script language="JavaScript" type="text/JavaScript">
    //              var n='hostmaster'; var d='airframes.org';
    //              document.write("<a href=\"mailto:" + n + "@" + d + "\">");
    //            </script>
    //      hostmaster at airframes.org
    //      <script type="text/JavaScript"> document.write('<\/a>');</script>&gt; [don't send spam]<br />
    //        Created 2005-08-11.
    //              Your visit 2023-03-10 05:24.56.
    //        Page created in 0.082 sec.
    //  </p>
 
    //  <P>
    //  European central bureaucrats force us to inform you that this site uses cookies. By using our services, you agree to our use of cookies. <a href="/cookies.php">More</a>.
    //  </p>
 
    //  <center class="small">
    //  <br />  [ <a href="http://www.airframes.org/">index page</a> ]
    //    [ <a href="http://www.airframes.org/about">about / impressum / disclaimer</a> ]
    //    [ <a href="/privacy-en" target="privacy" rel="nofollow">Privacy Policy (English) / </a> <a href="/privacy-de" target="privacy" rel="nofollow">Privacy Policy (German)</a> ]
    //    [ <a href="http://www.airframes.org/advertise.php">advertise</a> ]
    //  </center>
 
    //  </div>
 
    //  </div>
    //  </body>
    //  </html>
    //    `)
  
    let scrapedAirframeData = []
    let scrapedHeaders = []
    let airframedata = {}

    $('table > tbody > tr > th').each((index, element) => {
      scrapedHeaders.push($(element).text())
    })
    $('table > tbody > tr > td').each((index, element) => {
      scrapedAirframeData.push($(element).text())
    })

    // trim scraped data
    scrapedAirframeData = scrapedAirframeData.slice(17)
    scrapedHeaders = scrapedHeaders.slice(0,-1)
    //   console.log(scrapedAirframeData)
    //   console.log(scrapedHeaders)

    // create airframeData object
    scrapedHeaders.map((value, index) => {
      if (value.match(/\w/) && scrapedAirframeData[index].match(/\w/)){
        airframedata[scrapedHeaders[index]] = scrapedAirframeData[index]
      }
    })
    //   console.log(airframedata)
    return(airframedata)
  }
  catch(error) {
    return {}
  }
}
// performScrapingAirFrames()

// module export
exports.performScrapingAirFrames = performScrapingAirFrames

// successful scraped return example
// {
//   Registration: 'N658NK',
//   'Manuf.': 'Airbus',
//   Model: 'A321-231 (W)',
//   Type: 'A321',
//   'c/n': '6736',
//   'i/t': 'L2J',
//   Selcal: 'ELJR',
//   ICAO24: ' A8ABA8',
//   'Reg / Opr': 'NKS [NK] Spirit Airlines',
//   built: '2015',
//   'test reg': 'D-AYAH',
//   delivery: '2015-08-11',
//   status: 'active'
// }