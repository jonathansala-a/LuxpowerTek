import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// -----------------------
// Firebase Config
// -----------------------
const firebaseConfig = {
  apiKey: "AIzaSyBNpB_rDh6wBbInp1gppxZ27ZxeBU6Nb6g",
  authDomain: "luxpowertek-4f650.firebaseapp.com",
  projectId: "luxpowertek-4f650",
  storageBucket: "luxpowertek-4f650.appspot.com",
  messagingSenderId: "316144364474",
  appId: "1:316144364474:web:dfe8838c6ba0e874aa4b83"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// -----------------------
// Sidebar switching
// -----------------------
window.showSection = function (id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
};

// -----------------------
// Create Investor
// -----------------------
window.createInvestor = async function () {
  const name = document.getElementById("invName").value;
  const email = document.getElementById("invEmail").value;
  const plan = document.getElementById("invPlan").value;
  const amount = parseFloat(document.getElementById("invAmount").value);

  if (!name || !email || !plan || !amount) {
    return document.getElementById("createMsg").innerText = "All fields required.";
  }

  const uid = "INV" + Math.floor(100000 + Math.random() * 900000);

  await setDoc(doc(db, "users", uid), {
    name,
    email,
    plan,
    invested: amount,
    balance: amount,
    totalEarned: 0,
    status: "active",
    uid
  });

  document.getElementById("createMsg").innerText = `Investor created! UID: ${uid}`;
};

// -----------------------
// Credit Earnings
// -----------------------
window.creditEarnings = async function () {
  const uid = document.getElementById("earnUID").value;
  const amount = parseFloat(document.getElementById("earnAmount").value);

  if (!uid || !amount) {
    return document.getElementById("earnMsg").innerText = "All fields required.";
  }

  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    balance: amount + Number((await (await getDoc(userRef)).data()).balance),
    totalEarned: amount + Number((await (await getDoc(userRef)).data()).totalEarned)
  });

  await setDoc(doc(collection(db, "transactions")), {
    uid,
    type: "earning",
    amount,
    date: new Date().toISOString(),
    status: "completed"
  });

  document.getElementById("earnMsg").innerText = "Earnings credited!";
};

// -----------------------
// Logout
// -----------------------
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "admin-login.html";
  });
};
