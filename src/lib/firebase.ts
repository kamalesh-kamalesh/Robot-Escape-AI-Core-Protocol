import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase, ref, set, onValue, remove, update } from "firebase/database";
import { getFirestore, collection, doc, setDoc, onSnapshot, deleteDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZLNb0hrvyBRFBSssrXb60uD9RF9CDvqE",
  authDomain: "aimech-6f791.firebaseapp.com",
  databaseURL: "https://aimech-6f791-default-rtdb.firebaseio.com",
  projectId: "aimech-6f791",
  storageBucket: "aimech-6f791.firebasestorage.app",
  messagingSenderId: "287316231942",
  appId: "1:287316231942:web:a4f48570e4d19a22f04087",
  measurementId: "G-CFSLJC8LK4"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Analytics (supported in browser environment)
if (typeof window !== "undefined") {
  isSupported().then(supported => {
    if (supported) {
      getAnalytics(app);
    }
  }).catch(() => {});
}

export const rtdb = getDatabase(app);
export const db = getFirestore(app);

export interface TeamData {
  id: string;
  name: string;
  member1: string;
  member2: string;
  score: number;
  level: number;
  completedAt?: number;
  completionTimeFormatted?: string;
  tabSwitches?: number;
  createdAt: number;
}

// Sync helper functions to write to both Realtime Database & Firestore
export async function saveTeamToFirebase(team: TeamData) {
  try {
    const teamRef = ref(rtdb, `teams/${team.id}`);
    await set(teamRef, team);
  } catch (err) {
    console.warn("RTDB save notice:", err);
  }

  try {
    await setDoc(doc(db, "teams", team.id), team);
  } catch (err) {
    console.warn("Firestore save notice:", err);
  }
}

export async function updateTeamProgressInFirebase(id: string, updates: Partial<TeamData>) {
  try {
    const teamRef = ref(rtdb, `teams/${id}`);
    await update(teamRef, updates);
  } catch (err) {
    console.warn("RTDB update notice:", err);
  }

  try {
    await setDoc(doc(db, "teams", id), updates, { merge: true });
  } catch (err) {
    console.warn("Firestore update notice:", err);
  }
}

export async function deleteTeamFromFirebase(id: string) {
  try {
    await remove(ref(rtdb, `teams/${id}`));
  } catch (err) {
    console.warn("RTDB delete notice:", err);
  }

  try {
    await deleteDoc(doc(db, "teams", id));
  } catch (err) {
    console.warn("Firestore delete notice:", err);
  }
}

export async function clearAllTeamsFromFirebase() {
  try {
    await remove(ref(rtdb, `teams`));
  } catch (err) {
    console.warn("RTDB clear notice:", err);
  }

  try {
    const snapshot = await getDocs(collection(db, "teams"));
    for (const docItem of snapshot.docs) {
      await deleteDoc(doc(db, "teams", docItem.id));
    }
  } catch (err) {
    console.warn("Firestore clear notice:", err);
  }
}

export function subscribeToTeams(callback: (teams: TeamData[]) => void) {
  let rtdbHasData = false;

  const teamsRef = ref(rtdb, "teams");
  const unsubscribeRtdb = onValue(teamsRef, (snapshot) => {
    if (snapshot.exists()) {
      rtdbHasData = true;
      const data = snapshot.val();
      const list: TeamData[] = Object.values(data);
      callback(list);
    } else {
      if (!rtdbHasData) {
        callback([]);
      }
    }
  }, (err) => {
    console.warn("RTDB listener notice:", err);
  });

  const unsubscribeFirestore = onSnapshot(collection(db, "teams"), (snapshot) => {
    const list: TeamData[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as TeamData);
    });
    if (list.length > 0 || !rtdbHasData) {
      callback(list);
    }
  }, (err) => {
    console.warn("Firestore listener notice:", err);
  });

  return () => {
    unsubscribeRtdb();
    unsubscribeFirestore();
  };
}
