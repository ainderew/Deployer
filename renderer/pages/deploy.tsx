import React, { useEffect, useRef } from "react";
import Sidebar from "../components/sidebar/sidebar";
import { Button, Dropdown, Input, InputRef, Spin } from "antd";
import {
  ArrowLeftOutlined,
  BranchesOutlined,
  GitlabFilled,
  LoadingOutlined,
  MoreOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "../hooks/useRoute";
import useInitializeDeploy from "../hooks/useInitializeDeploy";
import TerminalOutput from "../components/terminalOutput/terminalOutput";
import OptionsMenu from "../components/deployer/optionsMenu";

export default function DeployPage(): React.ReactElement {
  const searchBarRef = useRef<InputRef>(null);
  const { home } = useNavigate();
  const {
    activeBranch,
    branches,
    loadingBranches,
    environmentName,
    projectName,
    openRemoteRepo,
    restartProcess,
    deploy,
    stdOut,
    showTerminal,
    setSearchBranches,
    searchBranches,
  } = useInitializeDeploy();

  function listenForSearchShortcut(e: KeyboardEvent) {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const isCommandPressed = isMac ? e.metaKey : e.ctrlKey;

    if (isCommandPressed && e.key === "f") {
      e.preventDefault();
      searchBarRef.current.focus();
      searchBarRef.current.select();
      console.log("TRUe");
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", listenForSearchShortcut);

    return () => {
      window.removeEventListener("keydown", listenForSearchShortcut);
    };
  }, []);

  return (
    <div className='grid grid-cols-[17rem_1fr] relative'>
      <Sidebar />
      <div className='w-full h-full flex flex-col py-12 px-36 items-center gap-4 overflow-hidden'>
        <Button onClick={home} className='self-start'>
          <ArrowLeftOutlined />
        </Button>
        <div className='w-full bg-white flex flex-col gap-4 text-[#000] p-4 border-[1px] rounded-md'>
          <div className='flex justify-between items-end w-full'>
            <span className='text-lg font-medium'>
              {environmentName} - {projectName}
            </span>
            <OptionsMenu />
          </div>
          <span className='font-medium text-sm'>
            <span className='text-gray-500'>Source:</span> <BranchesOutlined />{" "}
            {activeBranch}
          </span>
          <div className='flex gap-4'>
            <button
              onClick={openRemoteRepo}
              className='whitespace-nowrap hover:bg-white hover:text-black group hover:outline-black hover:outline transition-all duration-300 self-start bg-black text-white py-2 px-4 flex gap-2 text-sm items-center rounded-md'
            >
              <div className='rounded-full bg-white group-hover:bg-black group-hover:text-white transition-all duration-150 text-black w-6 h-6 flex items-center justify-center'>
                <GitlabFilled />
              </div>
              Remote Repository
            </button>
            <button
              onClick={restartProcess}
              className='whitespace-nowrap hover:bg-white hover:text-black group hover:outline-black hover:outline transition-all duration-300 self-start bg-black text-white py-2 px-4 flex gap-2 text-sm items-center rounded-md'
            >
              <div className='rounded-full bg-white group-hover:bg-black group-hover:text-white transition-all duration-150 text-black w-6 h-6 flex items-center justify-center'>
                <ReloadOutlined />
              </div>
              Restart Service
            </button>
          </div>
        </div>
        {showTerminal ? <TerminalOutput stdout={stdOut} /> : null}
        <div className='w-full flex flex-col gap-4'>
          <h4 className='text-xl'>Active Branches</h4>
          <Input
            ref={searchBarRef}
            prefix={<SearchOutlined />}
            className=''
            value={searchBranches}
            onChange={(e) => setSearchBranches(e.target.value)}
          />
          <div className='overflow-hidden h-[calc(100vh-330px-48px-420px)]'>
            <div className='flex flex-col gap-2 h-full overflow-scroll'>
              {loadingBranches ? (
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 24, color: "rgba(101,163,13,1)" }}
                      spin
                    />
                  }
                />
              ) : (
                branches
                  .sort((a, b) => b.localeCompare(a))
                  .map((br) => {
                    if (br.match(/\*/i)) {
                      return (
                        <button
                          key={br}
                          onClick={() => deploy(br.trim())}
                          className='text-sm bg-white p-4 text-left flex items-center gap-2 border-2 border-lime-600 border-l-[0.5rem] rounded-md hover:shadow-md transition-shadow duration-150'
                        >
                          <div className='border-[1px] p-3 flex items-center justify-center rounded-full'>
                            <BranchesOutlined />
                          </div>
                          {br}
                        </button>
                      );
                    }
                    return (
                      <button
                        key={br}
                        onClick={() => deploy(br.trim())}
                        className='text-sm bg-white p-4 text-left flex items-center gap-2 rounded-md border-[1px] hover:shadow-md transition-shadow duration-150'
                      >
                        <div className='border-[1px] p-3 flex items-center justify-center rounded-full'>
                          <BranchesOutlined />
                        </div>
                        {br}
                      </button>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
