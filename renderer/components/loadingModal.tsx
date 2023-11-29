import { Spin } from "antd";

interface propTypes {
  show: boolean;
}
function LoadingModal({ show }: propTypes) {
  return show ? (
    <div className='w-screen h-screen absolute top-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]'>
      <div className='flex flex-col gap-4 items-center justify-center p-16 bg-white shadow-lg rounded-md'>
        <Spin size="large" />
        <span className=''>Please Wait One Moment...</span>
      </div>
    </div>
  ) : null;
}

export default LoadingModal;
