// Initialize Firebase (same as auth.js)
const firebaseConfig = {
  apiKey: "AIzaSyBeQJUAg7K564nYuovIXOS4XkH7GWswEpQ",
  authDomain: "scorekeeper-da458.firebaseapp.com",
  projectId: "scorekeeper-da458",
  storageBucket: "scorekeeper-da458.firebasestorage.app",
  messagingSenderId: "564501839342",
  appId: "1:564501839342:web:27d5bcfacb7086f2f8e2ff"
};

firebase.initializeApp(firebaseConfig);
console.log('Firebase initialized:', firebase.app().name);
const auth = firebase.auth();
const db = firebase.firestore();

// Load tables when page loads
document.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged(user => {
    if (!user) window.location.href = '/';
    else loadTables();
  });
});

// Load All Tables
async function loadTables() {
  const userId = auth.currentUser.uid;
  const tablesContainer = document.getElementById('tables-container');
  
  db.collection('users').doc(userId).collection('tables')
    .onSnapshot(snapshot => {
      tablesContainer.innerHTML = '';
      snapshot.forEach(doc => renderTable(doc.id, doc.data()));
    });
}

// Render Single Table
function renderTable(tableId, { name, scores }) {
  const tableHTML = `
    <div class="card mb-4">
      <div class="card-header">${name}</div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-4">
            <select class="form-select player-select">
              ${Object.keys(scores).map(p => `<option>${p}</option>`).join('')}
            </select>
          </div>
          <div class="col-4">
            <input type="number" class="form-control score-input" placeholder="Score">
          </div>
          <div class="col-4">
            <button class="btn btn-primary w-100" 
                    onclick="addScore('${tableId}', this)">Add Score</button>
          </div>
        </div>
        <table class="table">
          <thead><tr>
            ${Object.keys(scores).map(p => `<th>${p}</th>`).join('')}
          </tr></thead>
          <tbody><tr>
            ${Object.values(scores).map(s => `<td>${s}</td>`).join('')}
          </tr></tbody>
        </table>
      </div>
    </div>
  `;
  
  tablesContainer.insertAdjacentHTML('beforeend', tableHTML);
}

// Add Score Function
window.addScore = function(tableId, btn) {
  const row = btn.closest('.row');
  const player = row.querySelector('.player-select').value;
  const score = Number(row.querySelector('.score-input').value);

  db.collection('users').doc(auth.currentUser.uid)
    .collection('tables').doc(tableId)
    .update({
      [`scores.${player}`]: firebase.firestore.FieldValue.increment(score)
    });
}

// Logout Handler
document.getElementById('logout').addEventListener('click', () => {
  auth.signOut().then(() => window.location.href = '/');
});
