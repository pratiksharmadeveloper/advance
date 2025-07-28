// src/app/admin/layout.tsx - Updated with overflow fix
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          {/* Only Admin Header - no public navbar */}
          <AdminHeader />
          
          {/* Divider */}
          <div className="border-t border-gray-200 w-full"></div>
          
          <div className="flex">
            {/* Sidebar */}
            <AdminSidebar />
            
            {/* Main Content */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="p-8 max-w-full overflow-x-hidden">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}