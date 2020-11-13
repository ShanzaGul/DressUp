// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    var storageRef = storage.ref();
    var user = firebase.auth().currentUser;
    fetchallPhotos();
  } else {
    console.log('user logged out' + user);
  }
})



// login
const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['inputEmail2'].value;
  const password = loginForm['inputPassword2'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);
    // moving the user to its main window
    loginForm.reset();
    window.location.href="addCloths.html";
  });

});