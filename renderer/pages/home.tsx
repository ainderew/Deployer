import React, { useContext} from "react";
import CreateEnvironmentModal from "../components/modal/createEnvironment/createEnvironment";
import useCreateEnvironment, {
  EnvironmentForm,
} from "../components/modal/createEnvironment/useCreateEnvironment";
import EnvironmentCard from "../components/environment/environmentCard";

import { Context } from "./_app";
import { useRedirectToEnvironment } from "../hooks/useRoute";

function HomePage(): React.ReactElement {
  const { toggleShow, show, formData, handleOnChange, saveEnvironment,toggleDatabaseReset } =
    useCreateEnvironment();
  const [_, setLoading,environments] = useContext(Context);


  const {redirectToEnvironment} = useRedirectToEnvironment()
 
  return (
    <div className='w-full h-screen flex justify-center items-center p-12 relative'>
      <div className='w-2/3 h-full flex flex-col gap-8'>
        <div className='flex gap-2'>
          <input
            type='text'
            className='w-full h-10 rounded-lg border-[1px] outline-none'
          />
          <button
            onClick={toggleShow}
            className='bg-[#171717] rounded-md text-sm text-white h-10 whitespace-nowrap px-6'
          >
            Add Environment
          </button>
        </div>

        <div className='grid xl:grid-cols-3 auto-rows-auto gap-4 shrink-0'>
          {environments.map((environment: EnvironmentForm) => {
            return (
              <EnvironmentCard
                redirectToEnvironment={redirectToEnvironment}
                environment={environment}
              />
            );
          })}
        </div>
      </div>

      {show && (
        <CreateEnvironmentModal
          toggleShow={toggleShow}
          formData={formData}
          handleOnChange={handleOnChange}
          saveEnvironment={saveEnvironment}
          toggleDatabaseReset={toggleDatabaseReset}
        />
      )}
    </div>
  );
}

export default HomePage;
