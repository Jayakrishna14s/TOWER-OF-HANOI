function exitGame() {
    var confirmExit = window.confirm("Are you sure you want to exit?");
    if (confirmExit) {
      window.close();
    }
}

function Page12(){
  document.getElementById('Page1').style.display = 'none';
  document.getElementById('Page2').style.display = 'block';
}

function Page21(){
  document.getElementById('Page2').style.display = 'none';
  document.getElementById('Page1').style.display = 'flex';
}

function Page23(){
  document.getElementById('Page2').style.display = 'none';
  document.getElementById('Page3').style.display = 'block';
}

function page2toRules()
{
  document.getElementById('Page2').style.display = 'none';
  document.getElementById('Rules').style.display = 'flex';

}

function Page32(){
  document.getElementById('Page3').style.display = 'none';
  document.getElementById('Page2').style.display = 'block';
}

function pageRulesTo2()
{
  document.getElementById('Rules').style.display = 'none';
  document.getElementById('Page2').style.display = 'block';
}

var numberOfDiscs = 0;
var MovesCount = 0;
var topValues=[11,21,31];
let MovesStored=[];

function addElement(x, y) {
  MovesStored.push({ x: x, y: y });
}

function SetNumberOfDiscs(num) {
    document.getElementById('Page3').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    MovesStored=[];
     const numberOfMoves = Math.pow(2, num) - 1;
     MovesCount=numberOfMoves;
     numberOfDiscs=num;
     topValues=[11,21,31];
     topValues[0]=topValues[0]-numberOfDiscs;
     moves();
     textBox("Start");
     resetAllDiscs();
     setTimeout(resetNumOfDiscs, 1000); 
}

function resetAllDiscs() {
  var rods = document.querySelectorAll('.rod');
  rods.forEach(function(rod) {
      var locations = rod.querySelectorAll('.location');
      locations.forEach(function(location, index) {
          var initialStyle = {
              width: (270 + index * 80) + '%',
              top: (2 + index * 10) + '%',
              backgroundColor: getColorByIndex(index),
              opacity: 1
          };
          Object.assign(location.style, initialStyle);
      });
  });
}

function getColorByIndex(index) {
  var colors = ['gray', 'pink', 'cyan', 'magenta', 'purple', 'blue', 'green', 'yellow', 'orange', 'red']  ;
  return colors[index];
}

function resetNumOfDiscs() {
  var rods = document.querySelectorAll('.rod');
  rods.forEach(
    function(rod, index) 
    {
      if(index===0)
      {
        var locations = rod.querySelectorAll('.location');
        locations.forEach
        (
          function(location, index) 
          {
            if(index < 10- numberOfDiscs  ){
                var initialStyle = {
                  width: (270 + index * 80) + '%',
                  top: (2 + index * 10) + '%',
                  backgroundColor: 'transparent',
                  opacity: 1
                };
                Object.assign(location.style, initialStyle);
            }
          }
        );
      }
      else
      {
        var locations = rod.querySelectorAll('.location');
        locations.forEach
        (
          function(location, index) 
          {
                var initialStyle = {
                  width: (270 + index * 80) + '%',
                  top: (2 + index * 10) + '%',
                  backgroundColor: 'transparent',
                  opacity: 1
                };
                Object.assign(location.style, initialStyle);
          }
        );
      }
    }
  );
}

var selectedDisc1 = 99;
var selectedDisc2 = 99;
var selectedRod1=0;
var selectedRod2=0;

function rodClick(rodNumber) {
  if(MovesCount === 0 )
    return;
  clearTextBox();

  if(selectedDisc1===99 && topValues[rodNumber-1]===10*rodNumber+1)
  {
     selectedRod1=rodNumber;
    invalidMove();//reset selected rods 1 2 to 99 and send sms
    return;
  }

  if(selectedDisc1===99 && topValues[rodNumber-1]!==10*rodNumber+1)
  {
    selectedRod1=rodNumber;
    selectedDisc1=topValues[rodNumber-1];
    fadeAway(selectedDisc1/*, selectedRod1*/);    //50% transparency
    topValues[rodNumber-1]++;
    console.log("opacity" + topValues)
    return;
  }

  if(selectedDisc1!==99 && selectedDisc2===99 && selectedDisc1=== topValues[rodNumber-1]-1 )
  {
    selectedRod2=rodNumber;
    emerge(selectedDisc1/*, selectedRod1*/);      //0% transparency
    topValues[selectedRod1-1]--;
    invalidMove();
    return;
  }

  if(selectedDisc1!==99 && selectedDisc2===99 && selectedDisc1!==topValues[rodNumber-1]-1   )
  {
    selectedRod2=rodNumber;
    if( topValues[rodNumber-1] !== rodNumber*10+1 && Width(selectedDisc1)>Width(topValues[rodNumber-1]))
    {
      emerge(selectedDisc1/*, selectedRod1*/);
      topValues[selectedRod1-1]--;
      invalidMove();
      return;
    }

    selectedDisc2 =  --topValues[rodNumber-1];
    swapColourWidthOpacity(selectedDisc1, selectedDisc2);
    emerge(selectedDisc2/*, selectedRod2*/);
    validMove();// enque disc numbers for undo
    MovesCount--;
    moves();
  }

  if(MovesCount === 0 )
  {
    console.log("inside if" + topValues + "discs" + numberOfDiscs);
    if(/*Utop[0] === 11-numberOfDiscs || */topValues[1]=== (21-numberOfDiscs) || topValues[2]=== (31-numberOfDiscs))
    {
      document.getElementById('textbox').textContent = "YOU WIN";
      setTimeout(youWin, 1000);
      console.log("WIN")
    }
    else
    {
      document.getElementById('textbox').textContent = "YOU LOST";

      setTimeout(youLost, 1000);
      console.log("LOST");
    }
  }
  console.log(topValues);
}

function Width(n){
  var elementId = 'location' + n;
  var element = document.getElementById(elementId);
  if (element) {
    return element.clientWidth;
  } else {
    return null; // Return null if the element is not found
  }
}

function invalidMove()
{
  selectedDisc1=99;
  selectedDisc2=99;
  selectedRod1=0;
  selectedRod2=0;
  textBox("Invalid-Move");
}

function validMove()
{
  addElement(selectedDisc1,selectedDisc2);
  selectedDisc1=99;
  selectedDisc2=99;
  selectedRod1=0;
  selectedRod2=0;
  textBox("Valid Move");
}

function fadeAway(n) {
  var elementId = 'location' + n;
  var element = document.getElementById(elementId);
  element.style.opacity = 0.5;
}

function emerge(n)
{
  var elementId = 'location' + n;
  var element = document.getElementById(elementId);
  element.style.opacity = 1;
}

function swapColourWidthOpacity(s1, s2) {
  var element1 = document.getElementById('location' + s1);
  var element2 = document.getElementById('location' + s2);
  if (element1 && element2) {
    var tempColor = element1.style.backgroundColor;
    element1.style.backgroundColor = element2.style.backgroundColor;
    element2.style.backgroundColor = tempColor;
    var tempWidth = element1.style.width;
    element1.style.width = element2.style.width;
    element2.style.width = tempWidth;
    var tempOpacity = element1.style.opacity;
    element1.style.opacity = element2.style.opacity;
    element2.style.opacity = tempOpacity;
  }
}

function moves()
{
  document.getElementById('movesCount').textContent = MovesCount;
}

function textBox(message) {
  document.getElementById('textbox').textContent = message;
}

function clearTextBox() {
  document.getElementById('textbox').textContent = '';
}

function undo()
{
  if(MovesCount===0) 
    return;
  
  if( MovesStored.length === 0)
  {
    textBox("Can't__Undo");
    if(selectedDisc1!==99)
    {
      emerge(selectedDisc1);
      1<=selectedDisc1&&selectedDisc1<=10? topValues[0]-- : (21<= selectedDisc1&& selectedDisc1<=20? topValues[1]--: topValues[2]--);
      selectedDisc1=99;
    }
    return;
  }

  if(selectedDisc1!==99)
  {
    emerge(selectedDisc1);
    1<=selectedDisc1&&selectedDisc1<=10? topValues[0]-- : (21<= selectedDisc1&& selectedDisc1<=20? topValues[1]--: topValues[2]--);
    selectedDisc1=99;
  }

  textBox("Undo");
  var element1 = document.getElementById('location' + MovesStored[MovesStored.length-1].x);
  var element2 = document.getElementById('location' + MovesStored[MovesStored.length-1].y);

  if (element1 && element2) {
    var tempColor = element1.style.backgroundColor;
    element1.style.backgroundColor = element2.style.backgroundColor;
    element2.style.backgroundColor = tempColor;
    var tempWidth = element1.style.width;
    element1.style.width = element2.style.width;
    element2.style.width = tempWidth;
    var tempOpacity = element1.style.opacity;
    element1.style.opacity = element2.style.opacity;
    element2.style.opacity = tempOpacity;
  }

  1<= MovesStored[MovesStored.length-1].y && MovesStored[MovesStored.length-1].y <=10 ? topValues[0]++ : (11<= MovesStored[MovesStored.length-1].y && MovesStored[MovesStored.length-1].y<=20 ? topValues[1]++ : topValues[2]++);
  1<= MovesStored[MovesStored.length-1].x && MovesStored[MovesStored.length-1].x <=10 ? topValues[0]-- : (11<= MovesStored[MovesStored.length-1].x && MovesStored[MovesStored.length-1].x<=20 ? topValues[1]-- : topValues[2]--);

  MovesCount++;
  moves();
  MovesStored.splice(MovesStored.length-1, 1);
}

function youWin()
{
  topValues[0]=11;
  topValues[1]=21;
  topValues[2]=31;
  selectedRod1=0;
  selectedRod2=0;
  selectedDisc1=99;
  selectedDisc2=99;
  MovesStored=[];
  setTimeout(Delay,1000);
  document.getElementById('game').style.display = 'none';
  document.getElementById('winlost').style.display = 'flex';
  document.getElementById('winlost').textContent = "YOU WIN";
  setTimeout(function() {
    document.getElementById('winlost').style.display = 'none';
    document.getElementById('Page2').style.display = 'block';
  }, 1000);
}

function youLost()
{
  topValues[0]=11;
  topValues[1]=21;
  topValues[2]=31;
  selectedRod1=0;
  selectedRod2=0;
  selectedDisc1=99;
  selectedDisc2=99;
  MovesStored=[];
  document.getElementById('game').style.display = 'none';
  document.getElementById('winlost').style.display = 'flex';
  document.getElementById('winlost').textContent = "YOU LOST";
  setTimeout(function() {
    document.getElementById('winlost').style.display = 'none';
    document.getElementById('Page2').style.display = 'block';
  }, 1000);
}

function Delay()
{
  return;
}

function gametopage2(){
  topValues[0]=11;
  topValues[1]=21;
  topValues[2]=31;
  selectedRod1=0;
  selectedRod2=0;
  selectedDisc1=99;
  selectedDisc2=99;
  document.getElementById('game').style.display = 'none';
  document.getElementById('Page2').style.display = 'block';
}

function gametoreset()
{
  SetNumberOfDiscs(numberOfDiscs);
}