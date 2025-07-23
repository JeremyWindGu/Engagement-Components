// Firebase Poll App - Tutorial JavaScript
// This script demonstrates how to integrate Firebase Realtime Database with a simple web app
// It shows real-time data synchronization across multiple users

// Wait for the DOM (Document Object Model) to be fully loaded before running any code
// This ensures all HTML elements exist before we try to access them
document.addEventListener('DOMContentLoaded', function() {
  
  // ========================================
  // STEP 1: FIREBASE CONFIGURATION
  // ========================================
  // Firebase configuration object - this connects your app to your Firebase project
  // You get these values from your Firebase Console (https://console.firebase.google.com)
  // 
  // To set up Firebase:
  // 1. Go to Firebase Console and create a new project
  // 2. Add a web app to your project
  // 3. Copy the config object that Firebase provides
  // 4. Replace the values below with your actual Firebase config
  
  const firebaseConfig = {
    apiKey: "AIzaSyDCQlhPR-4TN7oY5Xxr1V7y2Mkh7Yso8A4",
    authDomain: "engagement-components.firebaseapp.com",
    projectId: "engagement-components",
    storageBucket: "engagement-components.firebasestorage.app",
    messagingSenderId: "325365798054",
    appId: "1:325365798054:web:7191a397d6b599c035d067"
  };

  // Initialize Firebase - this connects your app to Firebase services
  // firebase.initializeApp() sets up the connection using your configuration
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the Firebase Realtime Database
  // This is like getting a "handle" to your database that you can use to read/write data
  const database = firebase.database();

  // ========================================
  // STEP 2: GET REFERENCES TO HTML ELEMENTS
  // ========================================
  // 获取问卷表单和连接状态元素
  const form = document.getElementById('survey-form');
  const connectionStatus = document.getElementById('connection-status');

  // ========================================
  // STEP 3: CONNECTION STATUS MONITORING
  // ========================================
  database.ref('.info/connected').on('value', function(snapshot) {
    const connected = snapshot.val();
    if (connected) {
      connectionStatus.innerHTML = '<p style="color: #4CAF50;">✅ Connected to Firebase</p>';
      console.log('Connected to Firebase');
    } else {
      connectionStatus.innerHTML = '<p style="color: #f44336;">❌ Disconnected from Firebase</p>';
      console.log('Disconnected from Firebase');
    }
  });

  // ========================================
  // STEP 4: FORM SUBMISSION TO FIREBASE
  // ========================================
  if (form) {
    // Section B: 选择Other时显示必填文本框
    form.addEventListener('change', function(e) {
      if (e.target.name === 'mostSensitive') {
        const otherBox = document.getElementById('other-textarea-container');
        if (e.target.value === 'other') {
          otherBox.style.display = '';
        } else {
          otherBox.style.display = 'none';
          document.getElementById('mostSensitiveOther').value = '';
        }
      }
    });
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const mostSensitive = formData.get('mostSensitive');
      const mostSensitiveOther = formData.get('mostSensitiveOther') || '';
      if (mostSensitive === 'other' && mostSensitiveOther.trim() === '') {
        alert('Please specify the other sensitive theme.');
        document.getElementById('mostSensitiveOther').focus();
        return;
      }
      // 只提交Section B内容
      const data = {
        mostSensitive,
        mostSensitiveOther,
        timestamp: Date.now()
      };
      database.ref('surveyResponses').push(data)
        .then(function() {
          form.reset();
          form.innerHTML = '<div style="text-align:center;color:#ff0;font-size:14px;margin:32px 0;">Thank you for your submission!<br>Your responses have been recorded.</div>';
        })
        .catch(function(error) {
          console.error('Submission error:', error);
          alert('Failed to submit. Please try again.');
        });
    });
  }

  // ========================================
  // STEP 5: HELPER FUNCTIONS
  // ========================================
  // These functions help us manage the user interface and provide feedback
  
  /**
   * showVoteConfirmation Function
   * Purpose: Show a brief confirmation message when a vote is recorded
   * @param {string} vote - The vote that was recorded ('Yes' or 'No')
   */
  function showVoteConfirmation(vote) {
    // Create a temporary confirmation message
    const confirmation = document.createElement('div');
    confirmation.className = 'vote-confirmation';
    confirmation.textContent = `Thank you for voting "${vote}"!`;
    confirmation.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add the confirmation to the page
    document.body.appendChild(confirmation);
    
    // Remove the confirmation after 3 seconds
    setTimeout(function() {
      confirmation.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(function() {
        if (confirmation.parentNode) {
          confirmation.parentNode.removeChild(confirmation);
        }
      }, 300);
    }, 3000);
  }

  /**
   * showError Function
   * Purpose: Show an error message if something goes wrong
   * @param {string} message - The error message to display
   */
  function showError(message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
    `;
    
    document.body.appendChild(error);
    
    setTimeout(function() {
      if (error.parentNode) {
        error.parentNode.removeChild(error);
      }
    }, 5000);
  }

  // ========================================
  // STEP 6: INITIALIZATION
  // ========================================
  // Set up any initial state when the page loads
  
  // Add CSS animations for the vote confirmation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  console.log('Firebase Poll App initialized successfully!');
  console.log('Tutorial: This app demonstrates real-time data synchronization with Firebase');
});

// ========================================
// FIREBASE TUTORIAL SUMMARY
// ========================================
/*
This tutorial demonstrates several key Firebase concepts:

1. CONFIGURATION: Setting up Firebase with your project credentials
2. DATABASE REFERENCE: Getting a handle to your Realtime Database
3. REAL-TIME LISTENERS: Using .on('value') to automatically update UI when data changes
4. DATA WRITING: Using .set() to save data to the database
5. DATA READING: Using .once('value') to read data once
6. ERROR HANDLING: Managing connection issues and errors
7. CONNECTION MONITORING: Checking if your app is connected to Firebase

Key Benefits of Firebase Realtime Database:
- Automatic synchronization across all connected users
- No server management required
- Real-time updates without page refreshes
- Built-in offline support
- Scalable and secure

To use this in your own project:
1. Create a Firebase project at https://console.firebase.google.com
2. Replace the firebaseConfig object with your actual project settings
3. Set up your database rules in the Firebase Console
4. Deploy your app to Firebase Hosting (optional but recommended)
*/ 