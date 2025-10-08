
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"

export default function SelectClass({ user }) {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await supabase.from("classes").select("*")
      if (!error) setClasses(data)
    }
    fetchClasses()
  }, [])

  const handleSelect = async () => {
    if (!selectedClass) return alert("Please select a class")
    await supabase.from("profiles").update({ class_id: selectedClass }).eq("id", user.id)
    navigate("/student")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-400">
      <div className="bg-white p-8 rounded shadow-md w-80 text-center">
        <h2 className="text-xl font-bold mb-4">Select Your Class</h2>
        <select
          className="w-full p-2 border rounded text-black mb-4"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">--Select--</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleSelect}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

