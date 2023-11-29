import { useRouter } from "next/router";

interface usePreviousReturnType {
  home: () => void;
  previous: () => void;
  reload: () => void;
}

export function useNavigate(): usePreviousReturnType {
  const router = useRouter();

  function home(): void {
    router.push("/home");
  }

  function previous(): void {
    router.back();
  }

  function reload(): void {
    try {
      router.reload();
    } catch (err) {
      throw err;
    }
  }

  return {
    home,
    previous,
    reload,
  };
}

interface useRedirectToEnvironmentReturnType {
  redirectToEnvironment: (
    sshCommand: string,
    projectDirectory: string,
    environmentName: string,
    projectName: string,
    processManagerName: string
  ) => void;
}

export function useRedirectToEnvironment(): useRedirectToEnvironmentReturnType {
  const router = useRouter();

  function redirectToEnvironment(
    sshCommand: string,
    projectDirectory: string,
    environmentName: string,
    projectName: string,
    processManagerName: string
  ): void {
    try {
      router.push(
        `/deploy?sshCommand=${sshCommand}&projectDirectory=${projectDirectory}&eName=${environmentName}&pName=${projectName}&pm=${processManagerName}`
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return {
    redirectToEnvironment,
  };
}
