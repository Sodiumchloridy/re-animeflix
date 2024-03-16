export default function Loading() {
    return (
        <main className="min-h-screen">
            <div className="w-full flex justify-center my-16 bg-gray-900">
                <div className="w-[70vw] h-[75vh] animate-pulse bg-gray-800"></div>
            </div>

            {/* Anime Information Section */}
            <section className="block sm:flex h-fit px-16">
                <div className="h-[40vh] rounded-md aspect-[3/4] sm:h-72 animate-pulse bg-gray-800"></div>
                <div className="m-0 mt-8 sm:ml-8 sm:mt-0">
                    <div className="z-10 h-4 w-72 rounded-lg animate-pulse bg-blue-gray-800"></div>
                    <div className="ml-8 my-4 h-4 w-24 rounded-md animate-pulse bg-blue-gray-800"></div>
                    <div className="ml-12 my-4 h-4 w-36 rounded-md animate-pulse bg-blue-gray-800"></div>
                    <div className="my-4 h-4 w-28 rounded-md animate-pulse bg-blue-gray-800"></div>
                    <div className="my-4 h-4 w-48 rounded-md animate-pulse bg-blue-gray-800"></div>
                    <div className="ml-4 my-4 h-4 w-96 rounded-md animate-pulse bg-blue-gray-800"></div>
                    <div className="ml-8 my-4 h-4 w-56 rounded-md animate-pulse bg-blue-gray-800"></div>
                    <div className="my-4 h-4 w-96 rounded-md animate-pulse bg-blue-gray-800"></div>
                </div>
            </section>

            {/* Episodes Section */}
            <section className="px-16 my-8">
                <div className="grid gap-3 grid-cols-10">
                    <div className="rounded-md p-3 h-10 bg-gray-900 animate-pulse"></div>
                    <div className="rounded-md p-3 bg-gray-900 animate-pulse"></div>
                    <div className="rounded-md p-3 bg-gray-900 animate-pulse"></div>
                    <div className="rounded-md p-3 bg-gray-900 animate-pulse"></div>
                    <div className="rounded-md p-3 bg-gray-900 animate-pulse"></div>
                    <div className="rounded-md p-3 bg-gray-900 animate-pulse"></div>
                    <div className="rounded-md p-3 bg-gray-900 animate-pulse"></div>
                    <div className="rounded-md p-3 bg-gray-900 animate-pulse"></div>
                </div>
            </section>
        </main>
    );
}
