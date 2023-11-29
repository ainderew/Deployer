import { CloseOutlined } from "@ant-design/icons";
import { Button, Checkbox, Switch } from "antd";
import { EnvironmentForm } from "./useCreateEnvironment";
import { ChangeEvent } from "react";

interface propTypes {
  toggleShow: () => void;
  formData: EnvironmentForm;
  handleOnChange: (e: ChangeEvent<HTMLTextAreaElement>, label: string) => void;
  saveEnvironment: () => void;
  toggleDatabaseReset: () => void;
}

function CreateEnvironmentModal({
  toggleShow,
  formData,
  handleOnChange,
  saveEnvironment,
  toggleDatabaseReset
}: propTypes): React.ReactElement {
  const {
    environmentName,
    sshCommand,
    projectName,
    projectDirectory,
    processManagerName,
    databaseName,
    databaseFlag
  } = formData;
  return (
    <div className='w-full h-full bg-[rgba(0,0,0,0.3)] absolute'>
      <div className=' w-[800px] p-8 flex flex-col gap-4 shadow-2xl absolute top-20 left-1/2 -translate-x-1/2 bg-white rounded-md'>
        <Button
          onClick={toggleShow}
          className='absolute right-5 top-5 border-none shadow-none outline-none '
        >
          <CloseOutlined />
        </Button>
        <div className='flex flex-col mb-5'>
          <h4 className='text-xl'>New Environment</h4>
          <span className='text-sm text-gray-400'>
            Connect to a new Virtual Machine
          </span>
        </div>

        <div className=''>
          <span className='text-sm text-gray-600 font-semibold'>
            SSH CONNECTION COMMAND
          </span>
          <textarea
            className='w-full !h-40 border-2 p-2 outline-blue-300 rounded-md'
            placeholder='ssh -i ~/.ssh/yourSSHkey host@192.xxx.xxx.xxx'
            onChange={(e) => handleOnChange(e, "sshCommand")}
            value={sshCommand}
          />
        </div>

        <div className=''>
          <span className='text-sm text-gray-600 font-semibold'>
            ENVIRONMENT NAME
          </span>
          <textarea
            className='w-full !h-10 overflow-hidden border-2 p-2 outline-blue-300 rounded-md'
            placeholder='Production Server/s'
            onChange={(e) => handleOnChange(e, "environmentName")}
            value={environmentName}
          />
        </div>

        <div className=''>
          <span className='text-sm text-gray-600 font-semibold'>
            PROJECT DIRECTORY
          </span>
          <textarea
            className='w-full !h-10 overflow-hidden border-2 p-2 outline-blue-300 rounded-md'
            placeholder='/var/web/tm-chateasy-server'
            onChange={(e) => handleOnChange(e, "projectDirectory")}
            value={projectDirectory}
          />
        </div>
        <div className=''>
          <span className='text-sm text-gray-600 font-semibold'>
            PROJECT NAME
          </span>
          <textarea
            className='w-full !h-10 overflow-hidden border-2 p-2 outline-blue-300 rounded-md'
            placeholder='ChatEasy Server'
            onChange={(e) => handleOnChange(e, "projectName")}
            value={projectName}
          />
        </div>
        <div className=''>
          <span className='text-sm text-gray-600 font-semibold'>
            PM2 ID / NAME
          </span>
          <textarea
            className='w-full !h-10 overflow-hidden border-2 p-2 outline-blue-300 rounded-md'
            placeholder='1'
            onChange={(e) => handleOnChange(e, "processManagerName")}
            value={processManagerName}
          />
        </div>

        <div className=''>
          <span className='text-sm text-gray-600 font-semibold'>
            DATABASE NAME
          </span>
          <textarea
            className={`w-full !h-10 overflow-hidden border-2 p-2 outline-blue-300 rounded-md
              ${databaseFlag ? null : "bg-gray-200 cursor-not-allowed text-gray-50"}
            `}
            placeholder=''
            onChange={(e) => handleOnChange(e, "databaseName")}
            value={databaseName}
            disabled={!databaseFlag}
          />
          <div className='flex gap-2 items-center'>
           <Switch
           onChange={toggleDatabaseReset}
           checked={databaseFlag}
           size="small"  rootClassName="bg-gray-300" />
            Enable Database Reset
          </div>
        </div>

        <div className='mt-10 flex justify-between'>
          <Button className='!text-black'>Connect</Button>
          <Button
            onClick={saveEnvironment}
            className='bg-[#171717] !text-white'
          >
            Save & Connect
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateEnvironmentModal;
