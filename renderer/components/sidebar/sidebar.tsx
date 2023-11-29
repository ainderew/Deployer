import { useContext } from "react";
import { Context } from "../../pages/_app";
import { EnvironmentForm } from "../modal/createEnvironment/useCreateEnvironment";
import { CodeFilled } from "@ant-design/icons";
import { useRedirectToEnvironment } from "../../hooks/useRoute";
import { useRouter } from "next/router";

function Sidebar() {
  const [, , environments] = useContext(Context);
  const { redirectToEnvironment } = useRedirectToEnvironment();

  const router = useRouter();

  return (
    <div className='bg-slate-100 w-full h-screen sticky top-0 flex flex-col gap-8 p-4'>
      <span className=''>Saved Environments</span>

      <div className='flex flex-col gap-4'>
        {environments.map((env: EnvironmentForm) => {
          const {
            sshCommand,
            projectDirectory,
            projectName,
            processManagerName,
            environmentName,
          } = env;
          return (
            <button
              key={env.id}
              onClick={() =>
                redirectToEnvironment(
                  sshCommand,
                  projectDirectory,
                  environmentName,
                  projectName,
                  processManagerName
                )
              }
              className={`text-left px-4 flex flex-col w-full h-12 items-start relative group hover:text-lime-600 transition-all duration-350
              ${
                env.environmentName === router.query.eName?.toString() &&
                env.projectName === router.query.pName?.toString()
                  ? "text-lime-600"
                  : null
              }
              `}
            >
              <div
                className={`w-2 rounded-lg left-0 h-full absolute group-hover:bg-lime-600 transition-all duration-350
              ${
                env.environmentName === router.query.eName?.toString() &&
                env.projectName === router.query.pName?.toString()
                  ? "bg-lime-600"
                  : "bg-[#5f6367]"
              }
              `}
              />
              <div className='grid grid-cols-[1rem_1fr] gap-2'>
                <CodeFilled />
                {env.environmentName}
              </div>
              <div className='grid grid-cols-[1rem_1fr] gap-2'>
                <div className=''></div>
                <span className='text-sm'>{env.projectName}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
