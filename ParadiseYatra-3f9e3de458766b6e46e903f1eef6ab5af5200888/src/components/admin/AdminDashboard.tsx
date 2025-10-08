"use client";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Destinations",
      value: "24",
      change: "+12%",
      changeType: "positive",
      icon: "🗺️",
    },
    {
      title: "Active Blogs",
      value: "18",
      change: "+5%",
      changeType: "positive",
      icon: "📝",
    },
    {
      title: "Total Bookings",
      value: "156",
      change: "+23%",
      changeType: "positive",
      icon: "📅",
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "+8%",
      changeType: "positive",
      icon: "💰",
    },
  ];

  const recentActivities = [
    {
      action: "New destination added",
      description: "Manali - Mountain Destination",
      time: "2 hours ago",
      type: "destination",
    },
    {
      action: "Blog published",
      description: "Top 10 Destinations for 2024",
      time: "4 hours ago",
      type: "blog",
    },
    {
      action: "Booking confirmed",
      description: "Premium Package - Maldives",
      time: "6 hours ago",
      type: "booking",
    },
    {
      action: "SEO updated",
      description: "Homepage meta tags",
      time: "1 day ago",
      type: "seo",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-700">Welcome back! Here&apos;s what&apos;s happening with your travel business.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-600">
            Add Destination
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors border border-green-600">
            Create Blog
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${
                stat.changeType === "positive" ? "text-green-600" : "text-red-600"
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-600 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === "destination" ? "bg-blue-500" :
                  activity.type === "blog" ? "bg-green-500" :
                  activity.type === "booking" ? "bg-blue-500" :
                  "bg-orange-500"
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-700">{activity.description}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🗺️</span>
                <div>
                  <p className="font-medium text-gray-900">Add New Destination</p>
                  <p className="text-sm text-gray-700">Create a new travel destination</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📝</span>
                <div>
                  <p className="font-medium text-gray-900">Write Blog Post</p>
                  <p className="text-sm text-gray-700">Create engaging content</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-xl">⚙️</span>
                <div>
                  <p className="font-medium text-gray-900">Update SEO</p>
                  <p className="text-sm text-gray-700">Optimize for search engines</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Website Status</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage</span>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                75% Used
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Backup</span>
              <span className="text-sm text-gray-900">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 