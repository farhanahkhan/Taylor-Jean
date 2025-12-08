// "use client";

// import { useState } from "react";

// export default function UsersTable() {
//   const [users, setUsers] = useState([
//     {
//       id: 1,
//       name: "John Smith",
//       email: "john@example.com",
//       role: "Fan",
//       status: "Active",
//       joined: "2024-01-15",
//     },
//     {
//       id: 2,
//       name: "Sarah Johnson",
//       email: "sarah@example.com",
//       role: "Team",
//       status: "Active",
//       joined: "2024-02-20",
//     },
//     {
//       id: 3,
//       name: "Mike Davis",
//       email: "mike@example.com",
//       role: "Organizer",
//       status: "Active",
//       joined: "2024-01-08",
//     },
//     {
//       id: 4,
//       name: "Emily Brown",
//       email: "emily@example.com",
//       role: "Fan",
//       status: "Suspended",
//       joined: "2024-03-12",
//     },
//   ]);

//   const [openMenu, setOpenMenu] = useState(null);

//   // ✅ DELETE ROW
//   const handleDelete = (id) => {
//     setUsers((prev) => prev.filter((user) => user.id !== id));
//     setOpenMenu(null);
//   };

//   // ✅ EDIT ROW
//   const handleEdit = (user) => {
//     alert(`Edit User: ${user.name}`);
//     setOpenMenu(null);
//   };

//   return (
//     <div className="p-6 bg-white rounded-xl shadow">
//       {/* ✅ Search Bar */}
//       <div className="flex gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Search users by name, email, or ID..."
//           className="w-full border px-4 py-2 rounded-md"
//         />
//         <button className="border px-4 py-2 rounded-md">Filters</button>
//       </div>

//       {/* ✅ Table */}
//       <table className="w-full text-sm">
//         <thead className="border-b text-gray-500 text-left">
//           <tr>
//             <th className="py-3">USER</th>
//             <th>ROLE</th>
//             <th>STATUS</th>
//             <th>JOINED</th>
//             <th>ACTIONS</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id} className="border-b">
//               <td className="py-4">
//                 <div className="font-semibold">{user.name}</div>
//                 <div className="text-gray-500">{user.email}</div>
//               </td>

//               <td>{user.role}</td>

//               <td>
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs ${
//                     user.status === "Active"
//                       ? "bg-green-100 text-green-600"
//                       : "bg-red-100 text-red-600"
//                   }`}
//                 >
//                   {user.status}
//                 </span>
//               </td>

//               <td>{user.joined}</td>

//               {/* ✅ ACTIONS */}
//               <td className="relative">
//                 <button
//                   onClick={() =>
//                     setOpenMenu(openMenu === user.id ? null : user.id)
//                   }
//                   className="text-xl font-bold"
//                 >
//                   ⋮
//                 </button>

//                 {openMenu === user.id && (
//                   <div className="absolute right-0 top-8 bg-white border rounded-md shadow-lg w-28 z-10">
//                     <button
//                       onClick={() => handleEdit(user)}
//                       className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                     >
//                       ✏ Edit
//                     </button>

//                     <button
//                       onClick={() => handleDelete(user.id)}
//                       className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
//                     >
//                       🗑 Delete
//                     </button>
//                   </div>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
