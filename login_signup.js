// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAmgi27Z3OBZ9lU6Jjq-Ogvd2fLXDYkp8M",
            authDomain: "login-abd5e.firebaseapp.com",
            projectId: "login-abd5e",
            storageBucket: "login-abd5e.appspot.com",
            messagingSenderId: "513298650429",
            appId: "1:513298650429:web:3b9f0db274d726dbb9a154",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()
  
  // Set up our register function
  function register (event) {
    // Get all our input fields 
    event.preventDefault();
    email = document.getElementById('sign_email').value
    password = document.getElementById('sign_password').value
    box=document.getElementById('checkbox')
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
    if(box.checked==false){
        alert('Accept terms and coditions')
        return
    }

   
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        email : email,
        password :password
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data)
  
      // DOne
      alert('User Created!!')
      document.getElementById("login_form").reset()
      window.location.href="index.html"
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  // Set up our login function
  function login (event) {
    // Get all our input fields
    event.preventDefault();
    email = document.getElementById('email').value
    password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)
  
      // DOne
      window.location.href="index.html"
  
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }

  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
//   function validate_field(field) {
//     if (field == null) {
//       return false
//     }
  
//     if (field.length <= 0) {
//       return false
//     } else {
//       return true
//     }
// }


function signOut() {
  auth.signOut()
  .then(function() {
      // Sign-out successful.
      // You can also redirect to a different page if needed.
      // window.location.href = "index.html";
  })
  .catch(function(error) {
      // An error happened.
      alert('Error during sign-out: ' + error.message);
  });
  }
  
  const autoLogoutDuration = 30 * 60 * 1000; // 30 minutes
  
  // Function to handle automatic logout
  function autoLogout() {
    // Get the current user
    const user = firebase.auth().currentUser;
  
    if (user) {
      // Revoke the refresh tokens
      user.getIdToken(true)
        .then(() => {
          // Sign out after revoking tokens
          return firebase.auth().signOut();
        })
        .then(() => {
          // Redirect or perform any other actions after logout
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Error revoking tokens:", error);
        });
    }
  }
  function startAutoLogoutTimer() {
    setTimeout(autoLogout, autoLogoutDuration);
  }
  
  
  
  
  function checkAuthStatus() {
  firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
          // User is signed in, show logout button
          document.getElementById('userEmail').textContent = user.email;
              document.getElementById('userDisplay').style.display = 'block';
          startAutoLogoutTimer();
          showLogoutButton();
      } else {
          // User is signed out, show login button
          document.getElementById('userDisplay').style.display = 'none';
          showLoginButton();
      }
  });
  }
  
  // Function to show login button
  function showLoginButton() {
  document.querySelector('.login-btn').style.display = 'block';
  document.querySelector('.logout-btn').style.display = 'none';
  }
  
  // Function to show logout button
  function showLogoutButton() {
  document.querySelector('.login-btn').style.display = 'none';
  document.querySelector('.logout-btn').style.display = 'block';
  }
  
  // Check authentication status when the page loads
  checkAuthStatus();
