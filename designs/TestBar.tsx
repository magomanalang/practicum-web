import { Outlet } from 'react-router';

export function SidebarLayoutTemplate() {
  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar */}
      <SidebarTemplate />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header (Optional) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">Page Title</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}