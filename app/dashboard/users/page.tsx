// app/dashboard/users/page.tsx

import React from "react";
import UserList from "@/components/dashboard/users/UserList";

export default function UsersPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <UserList />
    </div>
  );
}