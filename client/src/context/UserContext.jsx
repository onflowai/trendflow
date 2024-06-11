// import React, { createContext, useState, useContext, useEffect } from 'react';
// import customFetch from '../utils/customFetch'; // Adjust the path as needed
/**
 * Possible User Context if the need for more user state management will be required
 */
// const UserContext = createContext();

// export const useUser = () => {
//   return useContext(UserContext);
// };

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Function to fetch current user data and set the state
//   const fetchCurrentUser = async () => {
//     try {
//       const response = await customFetch.get('/users/current-user');
//       setUser(response.data.user);
//     } catch (error) {
//       console.error('Error fetching current user:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCurrentUser(); // Fetch user data on mount
//   }, []);

//   const updateUserImage = (profile_img, profile_img_id) => {
//     setUser((prevUser) => ({
//       ...prevUser,
//       profile_img,
//       profile_img_id,
//     }));
//   };

//   return (
//     <UserContext.Provider value={{ user, setUser, updateUserImage }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
