"use client";
import React from 'react' 

import Dashboard from '../Components/Dashboard'
import { useState } from "react";

type Operator = "+" | "-" | "*" | "/" | null;




const Home = () => {

  const [current, setCurrent] = useState("");
  const [previous, setPrevious] = useState("");
  const [operator, setOperator] = useState<Operator>(null);

  const handleNumber = (num: string) => {
    setCurrent((prev) => prev + num);
  };

  const handleOperator = (op: Operator) => {
    if (!current) return;
    setOperator(op);
    setPrevious(current);
    setCurrent("");
  };

  const handleClear = () => {
    setCurrent("");
    setPrevious("");
    setOperator(null);
  };

  const calculate = () => {
    const a = parseFloat(previous);
    const b = parseFloat(current);

    if (isNaN(a) || isNaN(b)) return;

    let result = 0;

    if (operator === "+") result = a + b;
    if (operator === "-") result = a - b;
    if (operator === "*") result = a * b;
    if (operator === "/") result = b !== 0 ? a / b : 0;

    setCurrent(result.toString());
    setPrevious("");
    setOperator(null);
  };

  return (
    <div>
      <Dashboard />




      <div className="w-full max-w-sm mx-auto mt-10 p-4 bg-black text-white rounded-xl font-mono">

        {/* Display */}
        <div className="bg-zinc-900 p-4 rounded-lg mb-4 text-right">
          <div className="text-sm text-gray-400">
            {previous} {operator}
          </div>
          <div className="text-2xl">{current || "0"}</div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={handleClear} className="col-span-4 p-3 bg-red-500 rounded-lg">C</button>

          {[1, 2, 3].map(n => (
            <button key={n} onClick={() => handleNumber(n.toString())} className="p-3 bg-zinc-800 rounded-lg">{n}</button>
          ))}
          <button onClick={() => handleOperator("+")} className="p-3 bg-blue-500 rounded-lg">+</button>

          {[4, 5, 6].map(n => (
            <button key={n} onClick={() => handleNumber(n.toString())} className="p-3 bg-zinc-800 rounded-lg">{n}</button>
          ))}
          <button onClick={() => handleOperator("-")} className="p-3 bg-blue-500 rounded-lg">-</button>

          {[7, 8, 9].map(n => (
            <button key={n} onClick={() => handleNumber(n.toString())} className="p-3 bg-zinc-800 rounded-lg">{n}</button>
          ))}
          <button onClick={() => handleOperator("*")} className="p-3 bg-blue-500 rounded-lg">*</button>

          <button onClick={() => handleNumber("0")} className="p-3 bg-zinc-800 rounded-lg">0</button>
          <button onClick={() => handleNumber(".")} className="p-3 bg-zinc-800 rounded-lg">.</button>
          <button onClick={calculate} className="p-3 bg-green-500 rounded-lg">=</button>
          <button onClick={() => handleOperator("/")} className="p-3 bg-blue-500 rounded-lg">/</button>
        </div>
      </div>

    </div>
  )
}

export default Home
