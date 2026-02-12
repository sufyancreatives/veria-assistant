'use client';

import { useState } from 'react';

export default function CrisisBanner() {
    const [isVisible, setIsVisible] = useState(false);

    // Auto-show banner functionality could be added here if needed
    // For now, it's a manual toggle or triggered by parent

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-red-500/30">

                {/* Header */}
                <div className="bg-red-500/10 p-6 text-center border-b border-red-500/20">
                    <div className="w-12 h-12 mx-auto mb-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-2xl font-bold">
                        !
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You Are Not Alone</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        If you are in immediate danger or having thoughts of harming yourself, please reach out now.
                    </p>
                </div>

                {/* Resources Grid */}
                <div className="p-6 grid gap-4 md:grid-cols-2">

                    {/* 988 Lifeline */}
                    <a href="tel:988" className="flex items-center p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors group">
                        <div className="text-3xl mr-4">📞</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-red-700 dark:text-red-400">988 Lifeline</h3>
                            <p className="text-sm text-red-600 dark:text-red-300">Call or text <strong>988</strong></p>
                            <span className="text-xs text-red-500 dark:text-red-400/70 mt-1 block">24/7 • Free • Confidential</span>
                        </div>
                    </a>

                    {/* Crisis Text Line */}
                    <a href="sms:741741?body=HOME" className="flex items-center p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors group">
                        <div className="text-3xl mr-4">💬</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-blue-700 dark:text-blue-400">Crisis Text Line</h3>
                            <p className="text-sm text-blue-600 dark:text-blue-300">Text <strong>HOME</strong> to <strong>741741</strong></p>
                            <span className="text-xs text-blue-500 dark:text-blue-400/70 mt-1 block">24/7 • Free • Confidential</span>
                        </div>
                    </a>

                    {/* Emergency 911 */}
                    <a href="tel:911" className="flex items-center p-4 rounded-xl border border-red-500 bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30 md:col-span-2">
                        <div className="text-3xl mr-4">🚨</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white">Emergency Services</h3>
                            <p className="text-sm text-red-100">Call <strong>911</strong> (US) or your local emergency number</p>
                        </div>
                        <div className="font-bold bg-white text-red-600 px-4 py-2 rounded-lg ml-auto">Call 911</div>
                    </a>

                    {/* International */}
                    <a href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:col-span-2">
                        <div className="text-3xl mr-4">🌍</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-700 dark:text-gray-300">International Crisis Centers</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Find help in your country</p>
                        </div>
                        <div className="text-gray-400">Visit &rarr;</div>
                    </a>

                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 text-center border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Your feelings are valid. Reaching out takes courage, and help is available.
                    </p>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// Named export for triggering the banner from other components if needed
export const useCrisisBanner = () => {
    // This hook implementation would require a Context provider
    // For now, we'll keep it simple and just export the component
    return {};
};
