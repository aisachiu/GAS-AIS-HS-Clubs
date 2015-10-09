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

  var thisSS = SpreadsheetApp.openById(myClubsSSId);
  var clubInfo = thisSS.getSheetByName(clubListSheetName).getDataRange().getValues();
  var clubMgrs = thisSS.getSheetByName(managerClubsSheetName).getDataRange().getValues();
  var clubMembers = thisSS.getSheetByName(studentclubsSheetName).getDataRange().getValues();
  var myMgClubs = ArrayLib.filterByValue(clubMgrs, managerEmailCol, thisUser);
  var myClubs = ArrayLib.filterByValue(clubMembers, studentEmailCol, thisUser);

  Logger.log(clubInfo);
  Logger.log(myMgClubs);
  Logger.log(myClubs);

  return [clubInfo, myMgClubs, myClubs];
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


/* joinThisClub
 *
 * Adds a user to the club list
 */
function joinThisClub(clubID) {
  var recordID = clubID+thisUser;
  var status = '0';
  var timeStamp = new Date();
  //Open Sheet - check sheet for data

  var thisSS = SpreadsheetApp.openById(myClubsSSId).getSheetByName(studentclubsSheetName);
  var studentClubData = thisSS.getDataRange().getValues();

  if (ArrayLib.filterByValue(studentClubData, 0, recordID).length < 1){
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);

    //Get the survey data.
    var lastRow = thisSS.getLastRow();
    var targetRange = thisSS.getRange(thisSS.getLastRow()+1, 1, 1, 7).setValues([[recordID, status, timeStamp, thisUser, "", clubID, ""]]);
    lock.releaseLock();
  }

  var newLists = getClubLists()
  return newLists;

}


/* include - allows html content to be included */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
