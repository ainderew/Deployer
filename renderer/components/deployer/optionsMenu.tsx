import { DatabaseFilled, MoreOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";

function OptionsMenu() {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
       <button>
         <DatabaseFilled className="mr-2" />
          Reset Database
       </button>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      placement='bottomRight'
      arrow={{ pointAtCenter: true }}
      trigger={["click"]}
    >
      <button
        onClick={() => {}}
        className='self-start bg-gray-200 w-10 h-10 rounded-full hover:scale-95 transition-all duration-200'
      >
        <MoreOutlined className='text-black' style={{ fontWeight: "bold" }} />
      </button>
    </Dropdown>
  );
}

export default OptionsMenu;
