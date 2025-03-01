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
  const email = document.getElementById('login-email').value; // Changed ID
  const password = document.getElementById('login-password').value; // Changed ID

  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = 'dashboard.html')
    .catch(error => showError(error.message));
});

// Toggle Forms Functionality
document.getElementById('switch-to-signup').addEventListener('click', () => {
  document.getElementById('login-form').classList.add('d-none');
  document.getElementById('signup-form').classList.remove('d-none');
});

// Signup Form Handler
document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  auth.createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    db.collection('users').doc(userCredential.user.uid).set({
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: userCredential.user.uid // Add this line
    });
      window.location.href = 'dashboard.html';
    });
    .catch(error => {
      showError(error.message);
      console.error("Signup Error:", error);
    });
});

// Error Display Function
function showError(message) {
  const errorDiv = document.getElementById('auth-error');
  errorDiv.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  errorDiv.classList.remove('d-none');
}
