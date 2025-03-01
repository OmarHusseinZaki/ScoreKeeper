// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBeQJUAg7K564nYuovIXOS4XkH7GWswEpQ",
  authDomain: "scorekeeper-da458.firebaseapp.com",
  projectId: "scorekeeper-da458",
  storageBucket: "scorekeeper-da458.firebasestorage.app",
  messagingSenderId: "564501839342",
  appId: "1:564501839342:web:27d5bcfacb7086f2f8e2ff"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Login Form Handler
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = 'dashboard.html')
    .catch(error => showError(error.message));
});

// Switch to Signup
document.getElementById('switch-to-signup').addEventListener('click', () => {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
});

// Signup Form Handler (add this form to your HTML)
document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => window.location.href = 'dashboard.html')
    .catch(error => showError(error.message));
});

// Signup Form Handler
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Create user document in Firestore
            db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            window.location.href = 'dashboard.html';
        })
        .catch(error => {
            showError(error.message);
            console.error("Signup Error:", error);
        });
});

// Toggle Forms Functionality
document.getElementById('switch-to-signup').addEventListener('click', () => {
    document.getElementById('login-form').classList.add('d-none');
    document.getElementById('signup-form').classList.remove('d-none');
});

// Error Display Function
function showError(message) {
  const errorDiv = document.getElementById('auth-error');
  errorDiv.textContent = message;
  errorDiv.classList.remove('d-none');
}
