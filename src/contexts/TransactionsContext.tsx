import { ReactNode } from "react";
import { useEffect, useState, useCallback } from "react"
import { api } from "../lib/axios";
import { createContext } from "use-context-selector";

interface Transactions {
  id: number
  description: string
  type: "income" | "outcome"
  price: number
  category: string
  createdAt: string
}

interface CreateTransactionInput {
  description: string
  price: number
  type: "income" | "outcome"
  category: string
}


interface TransactionsContextType {
  transactions: Transactions[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
}

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionContext = createContext({} as TransactionsContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {

  const [transactions, setTransactions] = useState<Transactions[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get("transactions", {
      params: {
        _sort: "createdAt",
        _order: "desc",
        q: query,
      }
    })
    
    setTransactions(response.data)
  }, [

  ])



  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { description, category, price, type } = data

      const response = await api.post("/transactions", {
        description,
        price,
        category,
        type,
        createdAt: new Date(),
      })

      setTransactions((state) => [...state, response.data])
    },
    []
  )
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionContext.Provider
      value={{ transactions, fetchTransactions, createTransaction: createTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  )
}