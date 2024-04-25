export default function GetLoanDetails({ params, }: {
  params: { loanId: string; };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-white to-gray-200 dark:from-gray-800 dark:via-black dark:to-gray-800">
      Loan details {params.loanId}
    </div>
  )
};