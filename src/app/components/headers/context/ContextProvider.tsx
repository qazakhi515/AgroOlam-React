import React, { ReactNode, useState } from "react";
import { Member } from "../../../../lib/types/member";
import { GlobalContext } from "../../hooks/useGlobals";

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authMember, setAuthMember] = useState<Member | null>(() => {
    try {
      const stored = localStorage.getItem("memberData");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  return (
    <GlobalContext.Provider
      value={{ authMember, setAuthMember, orderBuilder, setOrderBuilder }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
