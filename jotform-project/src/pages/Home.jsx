import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material'


export default function Home() {

    const firstValue = useSelector((state) => (state.firstSlice.value))
    const navigate = useNavigate();
    return (
        <div>
            <h2>{firstValue + 1}</h2>
            <Button onClick={() => (navigate("/about"))}>About</Button>

        </div>

    )
}

