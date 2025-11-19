// // import React from "react";
// // import { NavLink, useNavigate } from "react-router-dom";
// // import {
// //   LayoutDashboard,
// //   FolderKanban,
// //   ListChecks,
// //   Users,
// //   LogOut,
// // } from "lucide-react";

// // const Sidebar = () => {
// //   const navigate = useNavigate();
// //   const role = localStorage.getItem("role"); // 'admin' or 'member'

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("role");
// //     navigate("/login");
// //   };

// //   // ✅ Role-based navigation items
// //   const navItems =
// //     role === "admin"
// //       ? [
// //           { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
// //           { to: "/projects", label: "Projects", icon: <FolderKanban size={20} /> },
// //           { to: "/tasks", label: "Tasks", icon: <ListChecks size={20} /> },
// //           { to: "/users", label: "Users", icon: <Users size={20} /> },
// //         ]
// //       : [
// //           { to: "/member", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
// //           { to: "/my-projects", label: "My Projects", icon: <FolderKanban size={20} /> },
// //           { to: "/my-tasks", label: "My Tasks", icon: <ListChecks size={20} /> },
// //         ];

// //   return (
// //     <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col p-5">
// //       {/* App Name / Logo */}
// //       <div className="text-2xl font-bold mb-8 text-center">MPMS</div>

// //       {/* Navigation Links */}
// //       <nav className="flex-1 space-y-2">
// //         {navItems.map((item) => (
// //           <NavLink
// //             key={item.to}
// //             to={item.to}
// //             className={({ isActive }) =>
// //               `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
// //                 isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
// //               }`
// //             }
// //           >
// //             {item.icon}
// //             <span>{item.label}</span>
// //           </NavLink>
// //         ))}
// //       </nav>

// //       {/* Logout Button */}
// //       <button
// //         onClick={handleLogout}
// //         className="mt-6 flex items-center gap-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
// //       >
// //         <LogOut size={20} />
// //         <span>Logout</span>
// //       </button>
// //     </div>
// //   );
// // };

// // export default Sidebar;

// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   FolderKanban,
//   ListChecks,
//   Users,
//   User,
//   LogOut,
// } from "lucide-react";

// const Sidebar = () => {
//   const role = localStorage.getItem("role"); // 'admin' or 'member'
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.clear(); // ✅ clears token, role, and any cached info
//     navigate("/login");
//   };

//   // 🔹 Admin Navigation
//   const adminNav = [
//     { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
//     { to: "/projects", label: "Projects", icon: <FolderKanban size={20} /> },
//     { to: "/admin/tasks", label: "Tasks", icon: <ListChecks size={20} /> },
//     // { to: "/admin/users", label: "Users", icon: <Users size={20} /> },
//   ];

//   // 🔹 Member Navigation
//   const memberNav = [
//     { to: "/member", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
//     { to: "/member/tasks", label: "My Tasks", icon: <ListChecks size={20} /> },
//     { to: "/member/profile", label: "Profile", icon: <User size={20} /> },
//   ];

//   const navItems = role === "admin" ? adminNav : memberNav;

//   return (
//     <div className="w-64 bg-white shadow-md min-h-screen flex flex-col">
//       {/* Header */}
//       <div className="p-6 border-b">
//         <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
//           {role === "admin" ? "Admin Panel" : "Member Panel"}
//         </h2>
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex-1 mt-4">
//         {navItems.map((item) => (
//           <NavLink
//             key={item.to}
//             to={item.to}
//             end
//             className={({ isActive }) =>
//               `flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-150 ${
//                 isActive
//                   ? "bg-blue-100 text-blue-700 font-semibold"
//                   : "text-gray-600"
//               }`
//             }
//           >
//             <span className="mr-3">{item.icon}</span>
//             {item.label}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Logout Button */}
//       <div className="p-4 border-t">
//         <button
//           onClick={handleLogout}
//           className="flex items-center w-full gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all"
//         >
//           <LogOut size={18} />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  User,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Admin Menu
  const adminNav = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/admin/tasks", label: "Tasks", icon: ListChecks },
  ];

  // Member Menu
  const memberNav = [
    { to: "/member", label: "Dashboard", icon: LayoutDashboard },
    { to: "/member/tasks", label: "My Tasks", icon: ListChecks },
    { to: "/member/profile", label: "Profile", icon: User },
  ];

  const navItems = role === "admin" ? adminNav : memberNav;

  return (
    <div className="w-64 bg-[#111827] text-gray-300 h-screen flex flex-col shadow-xl sticky top-0">

      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white tracking-wide">
          {role === "admin" ? "Admin Panel" : "Member Panel"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">Management System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
                ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-500"
                    : "hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
