import * as React from "react"
import { cn } from "@/lib/utils"

const Select = ({ children, value, onValueChange }) => {
  return (
    <div className="relative">
      {React.Children.map(children, child => 
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return (
    <div className="relative">
      <button
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        ref={ref}
        {...props}
      >
        {children}
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, value }) => {
  return <span>{value || placeholder}</span>
}

const SelectContent = ({ children, value, onValueChange }) => {
  return (
    <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
      {React.Children.map(children, child => 
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  )
}

const SelectItem = ({ children, value: itemValue, value, onValueChange }) => {
  return (
    <div
      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
      onClick={() => onValueChange && onValueChange(itemValue)}
    >
      {children}
    </div>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }

