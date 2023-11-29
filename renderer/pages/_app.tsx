import React, { createContext, useEffect, useState } from "react";
import type { AppProps } from "next/app";

import "../styles/globals.css";
import LoadingModal from "../components/loadingModal";
import { EnvironmentForm } from "../components/modal/createEnvironment/useCreateEnvironment";

export const Context = createContext([]);

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [environments, setEnvironments] = useState<EnvironmentForm[]>([]);

  async function getEnvironments() {
    const environments = await window.deployer.getAllEnvironments();
    setEnvironments(environments);
  }

  useEffect(() => {
    getEnvironments();
  }, []);
  return (
    <>
    <Context.Provider value={[loading, setLoading, environments]} >
      <Component {...pageProps} />
      <LoadingModal show={loading} />
    </Context.Provider>
    </>
  );
}

export default MyApp;
