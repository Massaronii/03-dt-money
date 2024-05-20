import { ReactNode, createContext } from "react";
import { useEffect, useState } from "react"

interface Transactions {
  id: number
  description: string
  type: "income" | "outcome"
  price: number
  category: string
  createdAt: string
}


interface TransactionsContextType {
  transactions: Transactions[]
  fetchTransactions: (query?: string) => Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionContext = createContext({} as TransactionsContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {

  const [transactions, setTransactions] = useState<Transactions[]>([])

  async function fetchTransactions(query?: string) {

    const url = new URL("http://localhost:3333/transactions")

    if(query) {
      url.searchParams.append("q", query)
    }

    const response = await fetch(url)
    const data = await response.json()

    setTransactions(data)
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <TransactionContext.Provider value={{ transactions, fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  )
}