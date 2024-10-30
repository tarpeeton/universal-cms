"use client";
import { FC } from 'react';
import {sendSchema} from './sendSchema';
import DynamicForm from './form'

const Input: FC = () => {

  const handleClick = async () => {
    try {
      const result = await sendSchema(); // Call handler as an async function
      console.log('Schema sent successfully:', result);
    } catch (error) {
      console.error('Error sending schema:', error);
    }
  };













  return (
    <div>
      <button onClick={handleClick}>Click</button>
      <DynamicForm  schemaName='banner'/>
    </div>
  );
};

export default Input;
