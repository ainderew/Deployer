import { ChangeEvent, useEffect, useState } from "react";

interface useCreateEnvironmentReturnType {
  show: boolean;
  handleOnChange: (e: ChangeEvent<HTMLTextAreaElement>, label: string) => void;
  toggleShow: () => void;
  saveEnvironment: () => void;
  toggleDatabaseReset: () => void;
  formData: EnvironmentForm;
}

export interface EnvironmentForm {
  id?: string;
  environmentName: string;
  sshCommand: string;
  projectName: string;
  projectDirectory: string;
  processManagerName: string;
  databaseName?: string;
  databaseFlag: boolean;
}

function useCreateEnvironment(): useCreateEnvironmentReturnType {
  const [show, setShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<EnvironmentForm>({
    environmentName: "",
    sshCommand: "",
    projectName: "",
    projectDirectory: "",
    processManagerName: "",
    databaseName: "",
    databaseFlag: false,
  });

  function handleOnChange(
    e: ChangeEvent<HTMLTextAreaElement>,
    label: string
  ): void {
    setFormData((prev) => {
      return {
        ...prev,
        [label]: e.target.value,
      };
    });
  }

  function toggleShow(): void {
    console.log("TEST");
    setShow((prev) => !prev);
  }

  function toggleDatabaseReset() {
    setFormData((prev) => {
      return {
        ...prev,
        databaseFlag: !prev.databaseFlag,
      };
    });
  }

  useEffect(() => {
    console.log(formData.databaseFlag);
  }, [formData.databaseFlag]);

  async function saveEnvironment(): Promise<void> {
    const {
      environmentName,
      sshCommand,
      projectName,
      projectDirectory,
      processManagerName,
      databaseName,
      databaseFlag,
    } = formData;

    if (!databaseFlag) {
      await window.deployer.saveEnvironment(
        environmentName,
        sshCommand,
        projectName,
        projectDirectory,
        processManagerName
      );
      return;
    }

    await window.deployer.saveEnvironment(
      environmentName,
      sshCommand,
      projectName,
      projectDirectory,
      processManagerName,
      databaseName
    );
  }

  return {
    show,
    handleOnChange,
    toggleDatabaseReset,
    toggleShow,
    saveEnvironment,
    formData,
  };
}

export default useCreateEnvironment;
