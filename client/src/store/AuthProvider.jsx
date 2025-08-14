import { AuthContext } from ".";
import { useState } from "react";
import { getAuthenticatedUser, refreshAccessToken } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { LazyLoader } from "@/components/LazyLoader";

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  //query to refresh accessToken on app start
  useQuery({
    queryKey: ["refresh_token"],
    queryFn: async () => {
      setIsAuthenticating(true);
      const res = await refreshAccessToken();
      if (res.status === 200) {
        const newAccessToken = res.data?.data?.accessToken;
        setAccessToken(newAccessToken);
        setIsAuthenticating(false);
        return res;
      } else {
        setAccessToken(null);
        setIsAuthenticating(false);
        return null;
      }
    },
    enabled: !accessToken, //ensure it runs only when we don't have accessToken
    retry: false, //don't run again if the queryFn fails
  });

  //fetch auth user
  useQuery({
    queryKey: ["auth_user"], //cache key for our api call
    queryFn: async () => {
      setIsAuthenticating(true);
      const res = await getAuthenticatedUser(accessToken);
      if (res.status === 200) {
        setUser(res.data?.data);
        setIsAuthenticating(false);
        return res;
      }
      setIsAuthenticating(false);
      return null;
    },
    onError: async (error) => {
      console.error("Error fetching user", error);
      const res = await refreshAccessToken();
      if (res.status === 200) {
        const newAccessToken = res.data?.data?.accessToken;
        setAccessToken(newAccessToken);
      }
    },
    enabled: !!accessToken, //run only when we have the accessToken
  });

  console.log(user);

  if (isAuthenticating) {
    return <LazyLoader />;
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}
