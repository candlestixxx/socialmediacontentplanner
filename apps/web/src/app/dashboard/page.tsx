export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded shadow">
          <h2 className="font-semibold">Total Scheduled Posts</h2>
          <p className="text-2xl">42</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="font-semibold">Published Posts</h2>
          <p className="text-2xl">128</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="font-semibold">Revenue</h2>
          <p className="text-2xl">$4,200</p>
        </div>
      </div>
    </div>
  );
}
