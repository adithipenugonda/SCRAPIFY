import {
  useContext,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";


// ==========================================
// CUSTOM AUTH HOOK
// ==========================================
const useAuth = () => {

  return useContext(
    AuthContext
  );

};

export default useAuth;