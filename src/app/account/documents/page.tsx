import { FileText, Download } from "lucide-react";

export default function DocumentsPage() {
    const docs = [
        { name: "Hire Purchase Agreement - C200", date: "Jan 10, 2024", size: "2.4 MB" },
        { name: "Insurance Certificate", date: "Jan 10, 2024", size: "1.1 MB" },
        { name: "Payment Receipt #001", date: "Feb 01, 2024", size: "0.5 MB" },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-trust-900">Document Vault</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {docs.map((doc, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-2 rounded-lg text-trust-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                                    <p className="text-xs text-gray-500">{doc.date} • {doc.size}</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-action-teal">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
