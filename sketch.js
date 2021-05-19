//Create variables here
var dog, happydog;
var database;

var foodS, foodStock;;
var feeddog, addfood;
var fedTime, lastFed
var foodObj;

var changeGameState , readgameState;
var bedroom , garden , washroom;
var gameState;

var currentTime;
var petName, Name;

function preload() {
    saddog = loadImage("dogImg.png");
    happydog = loadImage("dogImg1.png");

    bedroom=loadImage("virtual pet images/Bed Room.png");
    garden=loadImage("virtual pet images/Garden.png");
    washroom=loadImage("virtual pet images/Wash Room.png");

    panting = loadSound("dogpanting.wav");
    barking = loadSound("barking.mp3");
}

function setup() {

    createCanvas(600, 500);
    
    foodObj = new Food();

    Doggie = createSprite(450, 240, 10, 10);
    Doggie.addImage(saddog);
   Doggie.scale=0.2;

    

    database = firebase.database();
    foodStock = database.ref('Food');
    foodStock.on("value", readStock);

    readgameState=database.ref('gameState');
    readgameState.on("value",function(data){
      gameState=data.val();
    })


    feed = createButton("Feed the dog");
    feed.position(700, 95);
    feed.mousePressed(feedDog);

   

    addFood = createButton("Add Food");
    addFood.position(800, 95);
    addFood.mousePressed(addFoods);

    input=createInput("Name Your Pet");
    input.position(750,440);
    
    button=createButton("SUBMIT");
    button.position(850,480);
    button.mousePressed(renamingDog)
  }
  


function draw() {
    background(46, 139, 87);

    

    
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }


   currentTime = hour();

   
   if(currentTime==(lastFed+1)){
     update("Playing");
     foodObj.garden();
   }else if(currentTime==(lastFed+2)){
     update("Sleeping");
     foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
   foodObj.washroom();
   }else{
     update("Hungry");
     foodObj.display();
   }

   if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    Doggie.remove();
  }else{
    feed.show();
    addFood.show();
   
    foodObj.display();
  }
 
  textSize(22)
  fill("black");
  stroke("black");
  textFont("chiller");
text("Your Pet Name: ",290,405);

  drawSprites();
    
 

    
}

function update(state){
database.ref('/').update({
  gameState:state
});

}




function readStock(data) {
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
}

    function feedDog (){
      Doggie.addImage(happydog);
    barking.play();
      foodObj.updateFoodStock(foodObj.getFoodStock()-1);
      database.ref('/').update({
        Food:foodObj.getFoodStock(),
        FeedTime:hour()
       
      })
    }

    function addFoods(){
      Doggie.addImage(saddog);
      panting.play();
      foodS++;
      database.ref('/').update({
        Food:foodS,
       
      })
     
      
    }

    function renamingDog()
{
  Name=input.value();
  button.hide();
  //input.hide();
  input.value().show();
  textSize(22)
  fill("white");
  stroke("black");
  textFont("chiller");
text("I'm Your pet " + input.value(),290,160);
  
}

