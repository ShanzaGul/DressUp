
var pantsUrllist = [];
var shoesUrllist = [];


//hide and show the sign in and sign up panels
function showSignIn(){
let b = document.querySelector('.signUp');
b.classList.add('hidden');
let a = document.querySelector('.signIn');
a.classList.remove('hidden');
};

function showSignUp(){
    let b = document.querySelector('.signIn');
    b.classList.add('hidden');
    let a = document.querySelector('.signUp');
    a.classList.remove('hidden');
    
    console.log("done")
    };    
    


const fetchallPhotos = async ()=>{
  // Create a reference under which you want to list
  var storageRef = storage.ref();
  var user = firebase.auth().currentUser;
  var listRef = storageRef.child('users/' + user.uid + '/shirts/');
  // Fetch the first page of 100.
  var firstPage = await listRef.list({ maxResults: 100});
  // Use the result.
  // processItems(firstPage.items)
  // processPrefixes(firstPage.prefixes)
  // Fetch the second page if there are more elements.
  var n = [];
  for (let i = 0 ; i < firstPage.items.length; i++)
  { 
    var m = await firstPage.items[i].getDownloadURL();
    var nameShirts = '/shirts/' + firstPage.items[i].name;
   
    setupCloset(m,nameShirts);
    n.push(m);
    //console.log(m);  
  }
 var nn = [];
  var listRef = storageRef.child('users/' + user.uid + '/pants/');
  var firstPage = await listRef.list({ maxResults: 100});
  for (let i = 0 ; i < firstPage.items.length; i++)
    { 
      var m = await firstPage.items[i].getDownloadURL();
      var namePants ='/pants/' + firstPage.items[i].name;
      setupCloset(m,namePants);
      nn.push(m);
      //console.log(m);  
    }
 
  var nnn=[];
  var listRef = storageRef.child('users/' + user.uid + '/shoes/');
  var firstPage = await listRef.list({ maxResults: 100});
    for (let i = 0 ; i < firstPage.items.length; i++)
    { 
      var m = await firstPage.items[i].getDownloadURL();
      var nameShoes = '/shoes/' + firstPage.items[i].name;
      setupCloset(m,nameShoes);
      nnn.push(m);
    }
  
 

 var rr = [n,nn,nnn];

  if (firstPage.nextPageToken) {
    var secondPage = await listRef.list({
      maxResults: 100,
      pageToken: firstPage.nextPageToken,
    });
    // processItems(secondPage.items)
    // processPrefixes(secondPage.prefixes)
  }

  return rr ;
};




//setting up the image card that are received from database

const listCloset = document.querySelector('.picsCloset');

const setupCloset = (imgUrl,imgName) => {

 var x = document.createElement("DIV");
 var y = document.createElement("img");
 var z = document.createElement("button");
 
 var pop = document.createElement("DIV");
 pop.classList.add("popUp", "d-flex" , "justify-content-center");;
 var btn = document.createElement("button");
 btn.classList.add("btn" , "btn-danger");
 btn.innerHTML = "Remove";
 btn.style.display="none";
 btn.onclick = removeFromCloset;
 pop.appendChild(btn);





  y.src=imgUrl;
  x.classList.add("card", "m-1" , "p-1");
  y.classList.add("pic"); 
  z.classList.add("w3-button", "w3-white","delete");
  z.id = imgName;
  z.innerHTML="x";
  z.style.outline = "none";

  z.onclick = removeBtn;
  x.appendChild(z);
  x.appendChild(pop);
  x.appendChild(y);
  
  listCloset.appendChild(x);



}


//setting up the outfit card that are received from database

const listOutfit = document.querySelector('.picsOutfit');

const setupOutfit = (imgArray) => {

 var mainDiv = document.createElement("DIV");
 var pairDiv = document.createElement("DIV");

 mainDiv.classList.add("d-flex",  "justify-content-around" , "justify-content-sm-center" ,  "flex-wrap" );
 pairDiv.classList.add("d-flex" ,"pair");
 pairDiv.innerHTML = "Pair" + imgArray[3];
 var x = document.createElement("DIV");
 var y = document.createElement("img");
 var xx = document.createElement("DIV");
 var yy = document.createElement("img");
 var xxx = document.createElement("DIV");
 var yyy = document.createElement("img");

  y.src=imgArray[0];
  x.classList.add("card", "m-1" , "p-1");
  y.classList.add("pic" , "shirtImg"); 
  x.appendChild(y);
  mainDiv.appendChild(x);
  
  
  yy.src=imgArray[1];
  xx.classList.add("card", "m-1" , "p-1");
  yy.classList.add("pic","pantsImg"); 
  xx.appendChild(yy);
  mainDiv.appendChild(xx);
  
 
  yyy.src=imgArray[2];
  xxx.classList.add("card", "m-1" , "p-1");
  yyy.classList.add("pic" ,"shoesImg"); 
  xxx.appendChild(yyy);
  mainDiv.appendChild(xxx);
  listOutfit.appendChild(mainDiv);
  listOutfit.appendChild(pairDiv);
}

// checking the current user state
auth.onAuthStateChanged(user => {
  if (user) {
  fetchallPhotos().then( (data)=>
    {
      display(data);
    }
   
    );
  } else {
    window.alert("Please Login to continue");
  }
}) ;

// This function displays the outfit array recieved from the database 
function display(a){

let temp = 1;
let temp2 = 0; 
for (let i = 0 ; i < a[0].length ; i++)
{
  for (let j = 0 ; j < a[1].length ; j++)
  { 
      let imgArray = [ a[0][i] , a[1][j], a[2][temp2], temp];
      setupOutfit(imgArray);
     if(temp2==(a[2].length-1))
     {
       temp2 = 0; 
     }
     else 
     {
      temp2++; 
     }
     temp ++ ;

  }
}

}


// upload the shirts to the database
const shirtuploadForm = document.querySelector('.shirtuploadForm');

shirtuploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let len = document.querySelector('#myshirt').files.length;
  var user = firebase.auth().currentUser;
  for(let i = 0; i < len; i++)
  {
    let img = document.querySelector('#myshirt').files[i];
    let imgName = img.name;
    let storageRef = storage.ref('users/' + user.uid + '/shirts/' + imgName);
    let uploadTask = storageRef.put(img);

    uploadTask.on('state_changed',function progress(snapshot){

      let percentage = snapshot.bytesTransferred/ snapshot.totalBytes * 100;
      let shprogress = document.querySelector('#sprogress');
      shprogress.innerHTML = Math.round(percentage) + " % uploaded";
   },function(error){
// error handling 
   },function(){
    
    {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        setupCloset(downloadURL,imgName);
        console.log('File available at', downloadURL);
      });
    }

   });
  }

});

//upload pants to the database
const pantsuploadForm = document.querySelector('.pantsuploadForm');

pantsuploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let len = document.querySelector('#mypants').files.length;
  var user = firebase.auth().currentUser;
  // get user info
  for(let i = 0; i < len; i++)
  {
    let imgg = document.querySelector('#mypants').files[i];
    let imggName = imgg.name;
    let storageRef = storage.ref('users/' + user.uid + '/pants/' + imggName);
    let uploadTask = storageRef.put(imgg);

    uploadTask.on('state_changed',function progress(snapshot){

      let percentage = snapshot.bytesTransferred/ snapshot.totalBytes * 100;
      let shprogress = document.querySelector('#pprogress');
      shprogress.innerHTML = percentage + " % uploaded"
   }, function(error){
    // error handling 
       },function(){
        
        {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            setupCloset(downloadURL,imggName);
            console.log('File available at', downloadURL);
          });
        }
    
       });
  }
  
});



//upload shoes to the database

const shoesuploadForm = document.querySelector('.shoesuploadForm');

shoesuploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let len = document.querySelector('#myshoe').files.length;
  var user = firebase.auth().currentUser;
  // get user info
  for(let i = 0; i < len; i++)
  { 
    let shoes = document.querySelector('#myshoe').files[i];
    let shoeName = shoes.name;
    let storageRef = storage.ref('users/' + user.uid + '/shoes/' + shoeName);
    let uploadTask = storageRef.put(shoes);

    uploadTask.on('state_changed',function progress(snapshot){

       let percentage = snapshot.bytesTransferred/ snapshot.totalBytes * 100;
       let shprogress = document.querySelector('#shprogress');
       shprogress.innerHTML = percentage + " % uploaded"
    },function(error){
      // error handling 
         },function(){
          
          {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              setupCloset(downloadURL,shoeName);
              console.log('File available at', downloadURL);
            });
          }
      
         });
  }

  
});

//Showing the Closet collection and the Outfit Collection

const closetControl = document.querySelector('#closet');
  
closetControl.addEventListener('click', ()=>{
  let b = document.querySelector('.outfit');
  b.classList.add('hidden');
  let a = document.querySelector('.closet');
  a.classList.remove('hidden');
  });


const outfitControl = document.querySelector('#outfit');

outfitControl.addEventListener('click',()=>{
  let b = document.querySelector('.closet');
  b.classList.add('hidden');
  let a = document.querySelector('.outfit');
  a.classList.remove('hidden');
  });
  
// delete from firebase 

function removeBtn(){
if(this.nextElementSibling.firstElementChild.style.display==='none')
{
  this.nextElementSibling.firstElementChild.style.display="block";
}
else
{
  this.nextElementSibling.firstElementChild.style.display="none";
}

}

function removeFromCloset(){

// Create a reference to the file to delete
var storageRef = storage.ref();
var user = firebase.auth().currentUser;
var srrc = this.parentElement.parentElement.firstChild.id;
this.parentElement.parentElement.remove();
console.log('users/' + user.uid + srrc);
var desertRef = storageRef.child('users/' + user.uid + srrc );

// Delete the file
desertRef.delete().then(function() {

  // File deleted successfully
  console.log("deleted");
}).catch(function(error) {
  // Uh-oh, an error occurred!
});

}




