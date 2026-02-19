export default function ContractsPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-trust-900">Active Contracts</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                        <tr>
                            <th className="p-4">Vehicle</th>
                            <th className="p-4">Contract ID</th>
                            <th className="p-4">Start Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Balance</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="p-4 font-medium text-trust-900">Mercedes-Benz C200</td>
                            <td className="p-4">HP-2024-8921</td>
                            <td className="p-4">Jan 10, 2024</td>
                            <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">ACTIVE</span></td>
                            <td className="p-4">KES 1,200,000</td>
                            <td className="p-4"><button className="text-action-teal hover:underline">View</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
