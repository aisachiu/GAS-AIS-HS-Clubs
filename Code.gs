/*
 *
 *     AIS-HS-CLUBS - an App that helps manage club enrollment at AIS
 *
 *
 */

//GLOBALS

var myClubsSSId = '1VfgfcSm7CQiOCRt0SiZ3lJcxAmlCsDo8GzL2aUuIwUc';

var clubListSheetName = 'Club List';
var clubListIDcol = 11;

var studentclubsSheetName = 'Student-Clubs';
var studentEmailCol = 3;
var clubMemberIDcol = 5;
var managerClubsSheetName = 'Club-Managers';
var managerEmailCol = 2;

var entityTitle = 'Extra Curricular Activities'; // used in titles throughout app

var thisUser = Session.getActiveUser().getEmail(); //get the logged-in user

var appTitle = 'AIS Extra Curricular Manager';

/*
* doGet - called when web URL accessed
*/
function doGet() {

  var myDoc = 'Index';
  return HtmlService.createTemplateFromFile(myDoc).evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);

}


/*
 * getClubLists - gets the info to display clublists
 */
function getClubLists(){


  var outHTML ='';

  var thisSS = SpreadsheetApp.openById(myClubsSSId);
  var clubInfo = thisSS.getSheetByName(clubListSheetName).getDataRange().getValues();
  var clubMgrs = thisSS.getSheetByName(managerClubsSheetName).getDataRange().getValues();
  var clubMembers = thisSS.getSheetByName(studentclubsSheetName).getDataRange().getValues();

  var myMgClubs = ArrayLib.filterByValue(clubMgrs, managerEmailCol, thisUser);


  var myClubs = ArrayLib.filterByValue(clubMembers, studentEmailCol, thisUser);

  //Created Activities List for Joining
  //
  var NewclubInfo = new Array();
  for (var x=1; x < clubInfo.length; x++) { //Find activities not joined yet
    var matching = ArrayLib.indexOf(myClubs, clubMemberIDcol, clubInfo[x][clubListIDcol]);
    Logger.log([clubInfo[x][clubListIDcol],matching]);
    if(matching<0){
      NewclubInfo.push(clubInfo[x]);
    }
  }

  Logger.log(NewclubInfo);


  if(myMgClubs.length > 0) {
    outHTML ='<div class="row"><div class="col-md-12"><h2>Activities I manage</h2></div></div><div class="row"><div class="col-md-6 col-sm-12"><table class="table table-striped">';

    for (var i=0; i < myMgClubs.length; i++) { // Get Club Details
      var thisClubDetails = ArrayLib.filterByValue(clubInfo, clubListIDcol, myMgClubs[i][1]);
      outHTML += '<tr><td><h3>'+thisClubDetails[0][1]+'</h3></td><td><button class="btn btn-info btn-members" data-id="'+myMgClubs[i][1]+'" data-toggle="button">Members</button></td></tr>'
      for (var j=0; j < thisClubDetails[0].length; j++) {
          myMgClubs[i].push(thisClubDetails[0][j]);

      }
    }
      outHTML += '</table></div><div class="col-md-6 col-sm-12" id="ActivityMembersSection"></div></div>';
  }




  if(myClubs.length > 0) {
    outHTML +='<div class="row"><div class="col-md-12"><h2>Activities I have joined</h2><table class="table table-striped">';
    //Add table header
    for (var i=0; i < myClubs.length; i++) { // Get Club Details
      var thisClubDetails = ArrayLib.filterByValue(clubInfo, clubListIDcol, myClubs[i][5]);
      outHTML += '<tr><td><span class="label label-success">'+myClubs[i][1]+'</span></td><td>'+thisClubDetails[0][1]+'</td><td>'+thisClubDetails[0][5]+'</td><td>'+thisClubDetails[0][6]+'</td><td>'+thisClubDetails[0][7]+'</td><td>'+thisClubDetails[0][8]+'</td></tr>'
      for (var j=0; j < thisClubDetails[0].length; j++) {
          myClubs[i].push(thisClubDetails[0][j]);

      }
    }
    outHTML += '</table></div></div>';
  }


  outHTML += '</table>';





  var outHTML2 = '<div class="row"><div class="col-md-12"><h2>Available Activities</h2><table class="table table-striped"><thead><tr><th>Activity Name</th><th>Faculty Advisor / Coach</th><th>Meeting day</th><th>Meeting Time</th><th>Meeting Place</th><th>Type</th><th>Action</th></tr><thead><tbody>';

  for(var k=0; k < NewclubInfo.length; k++){

    outHTML2 += '<tr><td>'+NewclubInfo[k][1]+'</td>';
    for (var m=5; m <=9; m++) outHTML2 += '<td>'+NewclubInfo[k][m]+'</td>';
    outHTML2 += '<td><button class="btn btn-warning btn-join" data-clubid="'+NewclubInfo[i][1]+'" data-memberid="'+thisUser+'" data-toggle="button">Join</button></td></tr>'
  }
  outHTML2 += '</tbody></table></div></div>'

  outHTML += outHTML2;

  return [outHTML];

}


/* getMemberLists($(this).data('id'))*/
function getMemberLists(myId){
  Logger.log(myId);
  var thisSS = SpreadsheetApp.openById(myClubsSSId);
  var clubMembers = ArrayLib.filterByValue(thisSS.getSheetByName(studentclubsSheetName).getDataRange().getValues(), clubMemberIDcol, myId);
  var clubInfo = ArrayLib.filterByValue(thisSS.getSheetByName(clubListSheetName).getDataRange().getValues(), clubListIDcol, myId);

  var outHTML = '';

  if(clubMembers.length > 0){
  outHTML += '<h1>'+clubInfo[0][1]+' Members</h1><table class="table"><thead><tr><td>Student</td><td>Email</td><td>Leadership</td></tr></thead><tbody>'
    for(var i=0; i < clubMembers.length; i++){
      outHTML += '<tr><td>'+clubMembers[i][4]+'<td>'+clubMembers[i][3]+'<td>'+clubMembers[i][6]+'</tr>';
    }
    outHTML +='</tbody></table>';
  } else {
  outHTML = '<div class="alert alert-warning">No Members in '+clubInfo[0][1]+' yet.<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a></div>';
  }
  return outHTML;
    Logger.log(outHTML);


}


/* include - allows html content to be included */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
