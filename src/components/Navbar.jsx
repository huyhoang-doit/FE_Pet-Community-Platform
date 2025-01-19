import { FaChevronDown } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

function Navbar() {
  const navBar = [
    {
      path: "#",
      name: "About",
      isArrow: false,
    },
    {
      path: "#",
      name: "Men",
      isArrow: true,
      dropdown: [
        {
          path: "#",
          name: "About",
        },
        {
          path: "#",
          name: "Contact",
        },
      ],
    },
    {
      path: "#",
      name: "Woman",
      isArrow: true,
      dropdown: [
        {
          path: "#",
          name: "About",
        },
        {
          path: "#",
          name: "Contact",
        },
      ],
    },
    {
      path: "#",
      name: "Boy",
      isArrow: true,
      dropdown: [
        {
          path: "#",
          name: "About",
        },
        {
          path: "#",
          name: "Contact",
        },
      ],
    },
    {
      path: "#",
      name: "Girl",
      isArrow: true,
      dropdown: [
        {
          path: "#",
          name: "About",
        },
        {
          path: "#",
          name: "Contact",
        },
      ],
    },
    {
      path: "#",
      name: "Accessories",
      isArrow: true,
      dropdown: [
        {
          path: "#",
          name: "About",
        },
        {
          path: "#",
          name: "Contact",
        },
      ],
    },
  ];
  return (
    <>
      {navBar.map((item) => {
        return (
          <div className="flex items-center" key={item.name}>
            <div className="relative group">
              <NavLink
                href={item.path}
                className="flex py-7 items-center gap-2 text-lg font-medium text-gray-500 hover:text-gray-900 h-full"
              >
                {item.name}
                {item.isArrow && (
                  <FaChevronDown className="group-hover:rotate-180 transition-all " />
                )}
              </NavLink>
              {item.dropdown && (
                <div className="absolute top-[5.1rem] bg-white p-2  opacity-0 invisible transform translate-y-4 transition-all duration-150 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                  {item.dropdown.map((subItem) => (
                    <NavLink
                      key={subItem.name}
                      to={subItem.path}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {subItem.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Navbar;
