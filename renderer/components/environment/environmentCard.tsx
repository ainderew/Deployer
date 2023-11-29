import { Avatar } from "antd";
import { EnvironmentForm } from "../modal/createEnvironment/useCreateEnvironment";

interface propTypes {
  redirectToEnvironment: (
    sshCommand: string,
    projectDir: string,
    environmentName: string,
    projectName: string,
    processManagerName: string
  ) => void;

  environment: EnvironmentForm;
}

function EnvironmentCard({
  redirectToEnvironment,
  environment,
}: propTypes): React.ReactElement {
  const {
    sshCommand,
    environmentName,
    processManagerName,
    projectDirectory,
    projectName,
  } = environment;
  return (
    <button
      onClick={() =>
        redirectToEnvironment(
          sshCommand,
          projectDirectory,
          environmentName,
          projectName,
          processManagerName
        )
      }
      className='p-8 flex flex-col border-[1px] rounded-md hover:shadow-md transition-shadow duration-150 shrink-0'
    >
      <div className='flex items-center gap-4 '>
        <Avatar className='flex-shrink-0' size={"large"}>
          AT
        </Avatar>
        <div className='flex flex-col items-start'>
          <span className='font-semibold'>{environmentName}</span>
          <span className='text-left text-gray-400'>{projectName}</span>
        </div>
      </div>
    </button>
  );
}

export default EnvironmentCard;
