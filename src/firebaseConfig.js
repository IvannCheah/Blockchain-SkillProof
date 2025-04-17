import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, or } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR-DATA",
  authDomain: "YOUR-DATA",
  projectId: "YOUR-DATA",
  storageBucket: "YOUR-DATA",
  messagingSenderId: "YOUR-DATA",
  appId: "YOUR-DATA",
  measurementId: "YOUR-DATA"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get user role based on ethAddress
const getUserRole = async (ethAddress) => {
  try {
    const lowercasedEthAddress = ethAddress.toLowerCase();
    const usersRef = collection(db, 'users');
    const q = query(usersRef);

    const querySnapshot = await getDocs(q);
    let userRole = 'NoRole';

    querySnapshot.forEach((doc) => {
      const user = doc.data();
      const storedEthAddress = user.ethAddress.toLowerCase();
      if (storedEthAddress === lowercasedEthAddress) {
        userRole = user.role;
      }
    });

    if (userRole === 'NoRole') {
      console.log('No user found with the provided ethAddress');
    }

    return userRole;
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'NoRole';
  }
};

// Search users by name or ethAddress
const getUsersBySearch = async (searchQuery) => {
  try {
    const usersRef = collection(db, 'users');
    let results = [];

    // Search by fullName
    const fullNameQuery = query(
      usersRef,
      where('fullName', '>=', searchQuery),
      where('fullName', '<=', searchQuery + '\uf8ff')
    );

    const fullNameSnapshot = await getDocs(fullNameQuery);
    if (!fullNameSnapshot.empty) {
      results = fullNameSnapshot.docs.map(doc => doc.data());
    }

    // If no results found, search by ethAddress
    if (results.length === 0) {
      const ethAddressQuery = query(
        usersRef,
        where('ethAddress', '>=', searchQuery),
        where('ethAddress', '<=', searchQuery + '\uf8ff')
      );

      const ethAddressSnapshot = await getDocs(ethAddressQuery);
      if (!ethAddressSnapshot.empty) {
        results = ethAddressSnapshot.docs.map(doc => doc.data());
      }
    }

    console.log("Search Results:", results); // Debug logging
    return results;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};

export { auth, db, getUserRole, getUsersBySearch };
