
interface propTypes {
  stdout: string;
}

function TerminalOutput({ stdout }: propTypes): React.ReactElement {
  return (
    <pre className='bg-black text-lime-500 w-full border-2 h-[22rem] overflow-scroll rounded-md p-4 relative flex flex-col-reverse text-sm'>
      <span className=''>&gt;{stdout}</span> 
    </pre>
  );
}

export default TerminalOutput;


