"use client"
import React,{useState,useEffect,ChangeEvent, } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
}
from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {FilePenIcon,PlusIcon,TrashIcon} from "lucide-react"
import { format } from "date-fns"


type Expense = {
    id:number,
    name:string,
    amount:number,
    date:Date
}

const initialExpense:Expense[]=[{
    id:1,
    name:"Groceries",
    amount:250,
    date:new Date("2024-5-15")

},{
    id: 2,
    name: "Rent",
    amount: 250,
    date: new Date("2024-06-01"),
  },
  {
    id: 3,
    name: "Utilities",
    amount: 250,
    date: new Date("2024-06-05"),
  },
  {
    id: 4,
    name: "Dining Out",
    amount: 250,
    date: new Date("2024-06-10"),
  },
]

export default function ExpenseTracker(){
    const [expense ,setExpense] = useState<Expense[]>([])
    const [showModal ,setShowModal] = useState<boolean>(false)
    const [isEditing,setIsEditing] = useState<boolean>(false)
    const [currentExpesneid,setCurrentExpenseId] = useState<number|null>(null)
    const [newExpense, setNewExpense]= useState<{
        name:string,
        amount:string,
        date:Date
    }>({
        name:"",
        amount:"",
        date:new Date()
    })
   
    useEffect(()=>{
        const storedExpenses = localStorage.getItem("expenses")
        if(storedExpenses){
            setExpense(JSON.parse(storedExpenses).map((expense:Expense)=>({
                ...expense,
                date:new Date(expense.date)

            }))
        )
        }else{
            setExpense(initialExpense)
        }
    },[])

    useEffect(()=>{
        if(expense.length>0){
            localStorage.setItem("expenses",JSON.stringify(expense))
        }
    },[expense])

    const handleAddExpense=():void=>{
        setExpense([
            ...expense,
            {
                id:expense.length+1,
                name:newExpense.name,
                amount:parseFloat(newExpense.amount),
                date:new Date(newExpense.date)
            }
        ])
        resetForm()
        setShowModal(false)

    }

    const handleEditExpense =(id:number):void=>{
        const expenseToEdit = expense.find((expense)=>expense.id===id)
        if(expenseToEdit){
            setNewExpense({
                name:expenseToEdit.name,
                amount:expenseToEdit.amount.toString(),
                date:expenseToEdit.date
            })
            setCurrentExpenseId(id)
            setIsEditing(true)
            setShowModal(true)

        }
    }
    
    const handleSavedEditExpense = ():void=>{
        setExpense(expense.map((expense)=>expense.id===currentExpesneid?{...expense,...newExpense,
            amount:parseFloat(newExpense.amount)
        }:expense
    ))
    resetForm()
    setShowModal(false)
    } 

    const resetForm = ():void=>{
        setNewExpense({
            name:"",
            amount:"",
            date:new Date()

        })
        setIsEditing(false)
        setCurrentExpenseId(null)

    }

    const handleDeleteExpense = (id:number):void=>{
        setExpense(expense.filter((expense)=>expense.id!==id))
    }
  
    const totalExpense= expense.reduce((total,expense)=>total+expense.amount,0)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target;
        setNewExpense((prevExpense) => ({
          ...prevExpense,
          [id]:
            id === "amount"
              ? parseFloat(value)
              : id === "date"
              ? new Date(value)
              : value,
        }));
      };
  
   return(
    <div className="flex flex-col h-screen">
        <header className="bg-primary text-primary-foreground py-4 px-6 shadow">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold"> 
                   Expense Tracker
                </h1>
                <div className="text-2xl font-bold">
                    Total:${totalExpense.toFixed(2)}

                </div>

            </div>

        </header>

        <main className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-4">
                {expense.map((expense)=>(
                    <li key={expense.id}
                    
                    className="bg-card p-4 rounded-lg shaodow flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-medium">
                                {expense.name}

                            </h3>
                            <p className="text-muted-foreground">
                                {expense.amount.toFixed(2)} -{""}
                                {format(expense.date,"dd/MM/yyyy")}
                            </p>
                        </div>
                      
                      <div className="flex gap-2">
                        <Button 
                        variant="ghost"
                        size="icon"
                        onClick={()=>handleEditExpense(expense.id)}>
                            <FilePenIcon className="w-5 h-5"/>
                        </Button>
                        <Button 
                        variant="ghost"
                        size="icon"
                        onClick={()=>handleDeleteExpense(expense.id)}
                        >
                            <TrashIcon className="w-5 h-5"/>
                        </Button>

                      </div>

                    </li>
                ))}

            </ul>

        </main>

        <div className="fixed bottom-6 right-6">
            <Button 
            size="icon"
            className="rounded-full shadow-lg"
            onClick={()=>{
                setShowModal(true)
                setIsEditing(false)
                resetForm()
            }}
            >
                <PlusIcon className="w-6 h-6"/>
            </Button>

        </div>
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="bg-card p-6 rounded-lg shadow w-full max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing?"Edit Expense":"Add Expense"}
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Expense Name</Label>
                            <Input 
                            id="name"
                            value={newExpense.name}
                            onChange={handleInputChange}
                            />


                        </div>
                        <div className="grid gap-2 ">
                            <Label htmlFor="amount" >Amount</Label>
                            <Input 
                            id="amount"
                            type="number"
                            value={newExpense.amount}
                            onChange={handleInputChange}
                            />


                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                            id="date"
                            type="date"
                            value={newExpense.date.toISOString().slice(0,10)}
                            onChange={handleInputChange}
/>
                        </div>

                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={()=>setShowModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                    onClick={isEditing?handleSavedEditExpense:handleAddExpense}>
                        {isEditing?"Save Changes":"Add Expense"}
                    </Button>
                    </DialogFooter>
            </DialogContent>
        </Dialog>


    </div>
   )




}