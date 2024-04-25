import Image from "next/image";

const GetLoan = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-white to-gray-200 dark:from-gray-800 dark:via-black dark:to-gray-800">
      Get Loan
    </div>
  )
};

export default GetLoan;


{/*
<div className="pt-16 p-8 flex flex-col items-center justify-center">
      <p className="text-center max-w-4xl text-4xl font-bold text-white px-4 py-4 mb-8 font-hero">
        Use your NFTs to get a loan
      </p>
      <div className="flex w-full max-w-5xl gap-8 shadow-xl rounded-2xl overflow-hidden">
        <div className="flex-1 p-4 bg-white dark:bg-gray-800 rounded-2xl">
          <h2 className="text-lg font-semibold">Lending and Borrowing Details</h2>
          <form className="space-y-4" id="loanForm">
            <div>
              <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-200">NFT Smart Contract</label>
              <input type="text" id="contractAddress" name="contractAddress" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white" required />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="nftId" className="block text-sm font-medium text-gray-700 dark:text-gray-200">NFT ID</label>
                <input type="text" id="nftId" name="nftId" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white" required />
              </div>
              <div className="w-1/2">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Duration (days)</label>
                <input type="number" id="duration" name="duration" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white" required />
              </div>
            </div>
            <div>
              <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Token Smart Contract Address</label>
              <input type="text" id="tokenAddress" name="tokenAddress" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="borrowAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount to Borrow</label>
              <input type="text" id="borrowAmount" name="borrowAmount" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white" required />
            </div>
          </form>
        </div>

        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
          <Image
            src="/placeholder-nft.png"
            alt="Placeholder NFT"
            width={300}
            height={300}
            className="opacity-50"
          />
        </div>
      </div>
      <button type="submit" form="loanForm" className="mt-8 px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Submit</button>
    </div>
*/}