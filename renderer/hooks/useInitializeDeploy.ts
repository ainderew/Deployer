import { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from "next/router";
import { Context } from "../pages/_app";
import { ipcRenderer } from "electron";
import { removeAllListeners } from "process";

function useInitializeDeploy() {
  const router = useRouter();
  const initial = useRef(true);

  const [activeBranch, setActiveBranch] = useState<string>("");
  const [branchesCopy, setBranchesCopy] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [loadingBranches, setLoadingBranches] = useState<boolean>(true);
  const [remoteURL, setRemoteURl] = useState<string>("");
  const [stdOut, setStdOut] = useState<string>("");
  const [showTerminal, setShowTerminal] = useState<boolean>(true);
  const [searchBranches, setSearchBranches] = useState<string>("");

  const sshCommand = router.query.sshCommand?.toString();
  const projectDirectory = router.query.projectDirectory?.toString();
  const environmentName = router.query.eName?.toString();
  const projectName = router.query.pName?.toString();
  const processManagerName = router.query.pm?.toString();

  const [_, setLoading] = useContext(Context);

  useEffect(() => {
    if (!projectDirectory) {
      router.push("/home");
      return;
    }

    getActiveBranch();
    getAllBranches();
    getRemoteUrl();
    setStdOut("")
  }, [router.asPath]);

  useEffect(() => {
    if (initial.current === true) {
      initial.current = false;
      return;
    }

    if (branches.length) {
      setLoadingBranches(false);
    }
  }, [branches]);

  useEffect(() => {
    if (initial.current === true) {
      return;
    }
    if (activeBranch === "") return;
  }, [activeBranch]);

  useEffect(() => {
    if (initial.current === true) return;

    if (searchBranches === "") {
      setBranches(branchesCopy);
      return;
    }
    const copy = [...branchesCopy];
    const filtered = copy.filter((branch: string) =>
      branch.includes(searchBranches)
    );
    setBranches(filtered);
  }, [searchBranches]);

  async function getActiveBranch() {
    const branchName = await window.deployer.getActiveBranch(
      sshCommand,
      projectDirectory
    );
    setActiveBranch(branchName.trim());
  }

  async function getAllBranches() {
    setLoadingBranches(true);
    const test = await window.deployer.getBranches(
      sshCommand,
      projectDirectory
    );
    const x = test.split("\n");
    x.shift();
    x.pop();
    setBranches(x);
    setBranchesCopy(x);
  }

  async function getRemoteUrl() {
    const urls = await window.deployer.getRemoteUrl(
      sshCommand,
      projectDirectory
    );
    const unparsedURL = urls.split("\n")[0];
    const urlRegex = /https:\/\/[^\s)]+/;
    const URL = unparsedURL.match(urlRegex);

    setRemoteURl(URL[0]);
  }

  async function openRemoteRepo() {
    await window.deployer.openRemoteRepo(remoteURL);
  }

  

  async function restartProcess() {
    await window.deployer.restartProcess(
      sshCommand,
      projectDirectory,
      processManagerName
    );
    console.log("RUNNING")
    window.deployer.onUpdateTerminal(async (_event, value) => {
      console.log(value)
      if(value === true){
        console.log("RESTART DONE!!!!!");
        await getAllBranches();
        await getActiveBranch();

        removeAllListeners("updateTerminal")
        return;
      }

      setStdOut((prev) => (prev += value));
    });
  }

  async function deploy(branchName: string) {
    setLoadingBranches(true);
    await window.deployer.deployBranch(
      sshCommand,
      projectDirectory,
      branchName,
      processManagerName
    );
    
    window.deployer.onUpdateTerminal(async (_event, value) => {
      if(value === true){
        console.log("DONE!!!!!");
        await getAllBranches();
        await getActiveBranch();

        return;
      }

      setStdOut((prev) => (prev += value));
    });

  }

  return {
    loadingBranches,
    branches,
    activeBranch,
    projectDirectory,
    sshCommand,
    getAllBranches,
    environmentName,
    getActiveBranch,
    projectName,
    remoteURL,
    openRemoteRepo,
    processManagerName,
    restartProcess,
    deploy,
    stdOut,
    showTerminal,
    searchBranches,
    setSearchBranches,
  };
}

export default useInitializeDeploy;
