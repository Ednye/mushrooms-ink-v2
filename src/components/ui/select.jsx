import * as React from "react"
import { cn } from "@/lib/utils"

const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectRef = React.useRef(null)
  
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  return (
    <div className="relative" ref={selectRef}>
      {React.Children.map(children, child => {
        if (child.type.displayName === 'SelectTrigger') {
          return React.cloneElement(child, { value, onValueChange, isOpen, setIsOpen })
        }
        return React.cloneElement(child, { value, onValueChange, isOpen, setIsOpen })
      })}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, value, onValueChange, isOpen, setIsOpen, ...props }, ref) => {
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setIsOpen && setIsOpen(!isOpen)}
      ref={ref}
      {...props}
    >
      {React.Children.map(children, child => 
        React.cloneElement(child, { value })
      )}
      <svg className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, value }) => {
  if (!value || value === 'all') {
    return <span className="text-gray-500">{placeholder}</span>
  }
  return <span>{value}</span>
}

const SelectContent = ({ children, value, onValueChange, isOpen, setIsOpen }) => {
  if (!isOpen) return null
  
  return (
    <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
      {React.Children.map(children, child => 
        React.cloneElement(child, { value, onValueChange, setIsOpen })
      )}
    </div>
  )
}

const SelectItem = ({ children, value: itemValue, value, onValueChange, setIsOpen }) => {
  return (
    <div
      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        if (onValueChange) onValueChange(itemValue)
        if (setIsOpen) setIsOpen(false)
      }}
    >
      {children}
    </div>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }

