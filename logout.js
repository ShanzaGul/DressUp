auth.onAuthStateChanged(user => {
  if (user) {
    console.log('user logged in: ');
  } else {
    console.log('user logged out');
  }
})
// logout
const logout = document.querySelector('#btnlogout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
  console.log('user signed out');
  window.location.href="index.html";
  })
});
