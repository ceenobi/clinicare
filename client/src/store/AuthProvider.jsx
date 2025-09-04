import { AuthContext } from ".";
import { useState, useEffect } from "react";
import { getAuthenticatedUser, refreshAccessToken } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { LazyLoader } from "@/components/LazyLoader";

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  //fetch refreshToken user
  const { isPending: isLoading, data: dataToken } = useQuery({
    queryKey: ["refresh_token"],
    queryFn: () => refreshAccessToken(),
    onError: async (error) => {
      console.error("Error refreshing accessToken", error);
      setAccessToken(null);
    },
    enabled: !accessToken,
    retry: false,
  });

  //set newaccessToken data
  useEffect(() => {
    if (dataToken?.status === 200) {
      const newAccessToken = dataToken?.data?.data?.accessToken;
      setAccessToken(newAccessToken);
    }
  }, [dataToken?.data?.data?.accessToken, dataToken?.status]);

  //fetch auth user data
  const { isPending, data } = useQuery({
    queryKey: ["auth_user", accessToken],
    queryFn: () => getAuthenticatedUser(accessToken),
    onError: async (error) => {
      console.error("Error fetching user", error);
    },
    enabled: !!accessToken,
  });

  //setuser data
  useEffect(() => {
    if (data?.status === 200) {
      setUser(data?.data?.data);
    }
  }, [data?.data?.data, data?.status]);

  if ((isPending && accessToken) || isLoading) {
    return <LazyLoader />;
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}
