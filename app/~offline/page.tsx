export const metadata = {
    title: 'Offline | Ali Haggag',
};

export default function OfflinePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-white p-4 text-center">
            <div className="text-6xl mb-6">📡</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">أنت غير متصل بالإنترنت</h1>
            <p className="text-lg text-gray-400 mb-8 max-w-md">
                يبدو أنك فقدت الاتصال بالإنترنت يا هندسة. بعض أجزاء الموقع قد لا تعمل حالياً، تأكد من الشبكة وحاول مرة أخرى.
            </p>
            <a
                href="/"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300"
            >
                إعادة المحاولة
            </a>
        </div>
    );
}