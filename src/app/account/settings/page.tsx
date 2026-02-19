"use client";

import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-trust-900">Account Settings</h2>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-lg mb-4">Profile Information</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input type="text" defaultValue="John" className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input type="text" defaultValue="Doe" className="w-full p-2 border rounded-md" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" defaultValue="john.doe@example.com" className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" defaultValue="+254 712 345 678" className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="pt-2">
                        <Button>Save Changes</Button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-lg mb-4">Preferences</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Email Notifications</span>
                        <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">SMS Alerts</span>
                        <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                </div>
            </div>
        </div>
    );
}
