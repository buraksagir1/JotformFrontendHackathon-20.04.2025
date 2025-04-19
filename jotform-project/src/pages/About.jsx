import { Button } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function About() {
    const firstValue = useSelector((state) => (state.firstSlice.value))
    const navigate = useNavigate();

    return (
        <div>
            <h3>About</h3>
            <h2>{firstValue + 3}</h2>
            <Button onClick={() => (navigate("/"))}>Home</Button>
        </div>
    )
}
