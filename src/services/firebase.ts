import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { Flat } from '../components/Interfaces/FlatInterface';
import { NewMessage } from '../components/Interfaces/MessageInterface';
import { User, UserRegister } from '../components/Interfaces/UserInterface';
import { auth, db, storage } from '../config/firebase';

const collectionName = 'users';
const usersColletionRef = collection(db, collectionName);
const flatsCollection = collection(db, 'flats');
const messagesCollection = collection(db, 'messages');

// Method to login a User
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log('User logged in:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

//Method to get user details by email
export const getUserByEmail = async (email: string): Promise<User[]> => {
  try {
    const queryData = query(usersColletionRef, where('email', '==', email));
    const querySnapshot = await getDocs(queryData);

    const users = querySnapshot.docs.map((doc) => {
      const data = doc.data() as User;
      return {
        ...data,
        profile: data.profile || '',
      };
    });

    return users;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};
//Method to create a User
export const createUser = async (user: UserRegister) => {
  await addDoc(usersColletionRef, user);
};

// Method to register auth user in Firebase
export const registerUserWithAuth = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user with auth:', error);
    throw error;
  }
};

//Method to register user with firestore in Firebase
export const registerUserWithFirestore = async (
  userId: string,
  user: UserRegister,
) => {
  try {
    await setDoc(doc(db, collectionName, userId), user);
  } catch (error) {
    console.error('Error registering user in Firestore', error);
    throw error;
  }
};

//Method to upload a profileImage
export const uploadProfileImage = async (file: File) => {
  try {
    const storageRef = ref(storage, `profileImages/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    console.log('Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Method to create a new flat
export const createFlat = async (
  flat: Omit<Flat, 'flatId'>,
): Promise<string> => {
  try {
    // Add the flat document to Firestore
    const docRef = await addDoc(flatsCollection, flat);

    // Get the newly created flat's ID
    const flatId = docRef.id;

    // Update the flat document to include the flatId
    await updateDoc(doc(db, 'flats', flatId), {
      flatId: flatId,
    });

    // Return the newly created flat's ID
    return flatId;
  } catch (error) {
    console.error('Error creating flat:', error);
    throw error;
  }
};

export const uploadFlatImage = async (file: File) => {
  try {
    const storageRefFlats = ref(storage, `flatImages/${file.name}`);
    await uploadBytes(storageRefFlats, file);
    const downloadURL = await getDownloadURL(storageRefFlats);
    console.log('Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const getFlats = async (): Promise<Flat[]> => {
  const flatsSnapshot = await getDocs(flatsCollection);
  return flatsSnapshot.docs.map((doc) => doc.data() as Flat);
};

export const getFlatsByOwner = async (ownerEmail: string): Promise<Flat[]> => {
  try {
    const flatsSnapshot = await getDocs(
      query(flatsCollection, where('flatUser', '==', ownerEmail)),
    );
    return flatsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        flatId: doc.id, // Use flatId instead of id
        areaSize: data.areaSize,
        city: data.city,
        dateAvailable: data.dateAvailable.toDate(),
        hasAc: data.hasAc,
        price: data.price,
        streetName: data.streetName,
        streetNumber: data.streetNumber,
        yearBuilt: data.yearBuilt,
        flatImage: data.flatImage,
        flatUser: data.flatUser,
        rooms: data.rooms,
        bathrooms: data.bathrooms,
      } as Flat;
    });
  } catch (error) {
    console.error('Error fetching flats by owner:', error);
    throw error;
  }
};

// export const getFlatsByUserId = async (userEmail: string): Promise<Flat[]> => {
//   try {
//     const flatsSnapshot = await getDocs(
//       query(flatsCollection, where('flatUser', '==', userEmail)),
//     );
//     return flatsSnapshot.docs.map((doc) => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         areaSize: data.areaSize,
//         city: data.city,
//         dateAvailable: data.dateAvailable.toDate(),
//         hasAc: data.hasAc,
//         price: data.price,
//         streetName: data.streetName,
//         streetNumber: data.streetNumber,
//         yearBuilt: data.yearBuilt,
//         flatImage: data.flatImage,
//         flatUser: data.flatUser,
//         rooms: data.rooms,
//         bathrooms: data.bathrooms,
//       } as Flat;
//     });
//   } catch (error) {
//     console.error('Error fetching flats by user email:', error);
//     throw error;
//   }
// };

export const getFlatById = async (flatId: string): Promise<Flat | null> => {
  try {
    const flatDoc = await getDoc(doc(db, 'flats', flatId));
    if (flatDoc.exists()) {
      const data = flatDoc.data();
      return {
        flatId: flatDoc.id, // Use flatId instead of id
        areaSize: data.areaSize,
        city: data.city,
        dateAvailable: data.dateAvailable.toDate(),
        hasAc: data.hasAc,
        price: data.price,
        streetName: data.streetName,
        streetNumber: data.streetNumber,
        yearBuilt: data.yearBuilt,
        flatImage: data.flatImage,
        flatUser: data.flatUser,
        rooms: data.rooms,
        bathrooms: data.bathrooms,
      } as Flat;
    } else {
      console.error(`Flat with ID ${flatId} not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching flat by ID:', error);
    throw error;
  }
};

export const updateFlat = async (flat: Flat) => {
  try {
    const { flatId, ...flatData } = flat;

    if (!flatId) {
      throw new Error('Flat ID is missing.');
    }

    const flatRef = doc(db, 'flats', flatId);
    await updateDoc(flatRef, flatData);
  } catch (error) {
    console.error('Error updating flat:', error);
    throw error;
  }
};

export const deleteFlat = async (flatId: string) => {
  try {
    if (!flatId) {
      throw new Error('Flat ID is missing.');
    }

    const flatRef = doc(db, 'flats', flatId);

    // Optional: Check if the document exists before attempting to delete it
    const flatDoc = await getDoc(flatRef);
    if (!flatDoc.exists()) {
      throw new Error(`Flat with ID ${flatId} does not exist.`);
    }

    await deleteDoc(flatRef);
    console.log(`Flat with ID ${flatId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting flat:', error);
    throw error;
  }
};

// Function to toggle flat to user's favorites
export const toggleFavoriteFlat = async (
  userEmail: string,
  flatId: string,
  isFavorite: boolean,
) => {
  if (!userEmail || !flatId) {
    console.error('Invalid userEmail or flatId');
    return;
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error(`No user document found for ${userEmail}`);
      throw new Error(`User document does not exist for ${userEmail}`);
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = userDoc.ref;

    if (isFavorite) {
      // Remove the flat from favorites
      await updateDoc(userRef, {
        favoriteFlats: arrayRemove(flatId),
      });
      console.log(
        `Flat ${flatId} removed from favorites for user ${userEmail}`,
      );
    } else {
      // Add the flat to favorites
      await updateDoc(userRef, {
        favoriteFlats: arrayUnion(flatId),
      });
      console.log(`Flat ${flatId} added to favorites for user ${userEmail}`);
    }
  } catch (error) {
    console.error('Error toggling flat favorite status:', error);
    throw error;
  }
};

// Get Flats created by logged user
export const getUserFlats = async (email: string): Promise<Flat[]> => {
  try {
    const flatsRef = collection(db, 'flats');
    const q = query(flatsRef, where('flatUser', '==', email)); // Query flats by flatUser email
    const querySnapshot = await getDocs(q);

    const flats: Flat[] = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      flatId: doc.id,
    })) as Flat[];

    return flats;
  } catch (error) {
    console.error('Error fetching user flats:', error);
    throw error;
  }
};

//Method to update the user
export const updateUserByEmail = async (
  email: string,
  updatedData: Partial<UserRegister>,
) => {
  try {
    // Reference to the "users" collection
    const usersCollectionRef = collection(db, 'users');

    // Query to find the document with the specified email
    const q = query(usersCollectionRef, where('email', '==', email));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if a matching document was found
    if (querySnapshot.empty) {
      throw new Error('User not found with the provided email.');
    }

    // Assuming emails are unique, we should only have one document
    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, 'users', userDoc.id);

    // Update the user document with the new data
    await updateDoc(userDocRef, updatedData);

    console.log('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Method to verify the user password
export const verifyUserPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log('User authenticated:', userCredential.user);
    return true;
  } catch (error) {
    console.error('Authentication failed:', error);
    return false;
  }
};

export const deleteProfileImage = async (imageUrl: string) => {
  try {
    // Create a reference to the file to delete
    const imageRef = ref(storage, imageUrl);

    // Delete the file
    await deleteObject(imageRef);

    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Method to create a new flat
export const createMessage = async (
  message: Omit<NewMessage, 'flatId'>,
): Promise<string> => {
  try {
    // Add the flat document to Firestore
    const docRef = await addDoc(messagesCollection, message);

    // Get the newly created flat's ID
    const messageId = docRef.id;

    // Update the flat document to include the messageId
    await updateDoc(doc(db, 'messages', messageId), {
      messageId: messageId,
    });

    // Return the newly created flat's ID
    return messageId;
  } catch (error) {
    console.error('Error creating flat:', error);
    throw error;
  }
};
export const deleteUserByEmail = async (email: string) => {
  try {
    // Reference to the "users" collection
    const usersCollectionRef = collection(db, 'users');

    // Query to find the document with the specified email
    const q = query(usersCollectionRef, where('email', '==', email));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if a matching document was found
    if (querySnapshot.empty) {
      throw new Error('User not found with the provided email.');
    }

    // Assuming emails are unique, we should only have one document
    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, 'users', userDoc.id);

    // Delete the user document
    await deleteDoc(userDocRef);

    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
