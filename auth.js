
  
  // signup
const signupForm = document.querySelector('.signupform');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['inputEmail'].value;
  const password = signupForm['inputPassword'].value;

  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    console.log(cred.user);
    signupForm.reset();
    window.location.href="addCloths.html";
  });
   
  
});
